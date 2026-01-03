from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from elasticsearch import Elasticsearch
from typing import Optional
from enum import Enum
from contextlib import asynccontextmanager
import json
import os

class SortOrder(str, Enum):
    newest = "newest"
    oldest = "oldest"

# Elasticsearch client will be initialized lazily
es = None

def get_es_client():
    """Get or initialize Elasticsearch client with connection check"""
    global es
    if es is None:
        es = Elasticsearch(
            ['http://localhost:9200'],
            # Disable SSL verification for local development
            verify_certs=False,
            ssl_show_warn=False
        )
    return es

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Check Elasticsearch connection on startup"""
    try:
        client = get_es_client()
        if client.ping():
            print("✓ Connected to Elasticsearch")
        else:
            print("⚠ Warning: Cannot connect to Elasticsearch. Falling back to JSON data.")
    except Exception as e:
        print(f"⚠ Warning: Elasticsearch connection failed: {e}. Falling back to JSON data.")
    yield
    # Cleanup on shutdown (if needed)

app = FastAPI(title="Job Hunter API", version="1.0.0", lifespan=lifespan)

# Elasticsearch index name
INDEX_NAME = "jobs"

# Configure CORS to allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load jobs data
def load_jobs():
    """Load jobs from JSON file"""
    json_path = os.path.join(os.path.dirname(__file__), "data", "jobs.json")
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)

# Load companies metadata (optional file)
def load_companies():
    json_path = os.path.join(os.path.dirname(__file__), "data", "companies.json")
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            return json.load(f)
    # If the optional companies.json file is missing, intentionally fall back to an empty list.
    return []

@app.get("/")
def root():
    """Root endpoint"""
    return {"message": "Job Hunter API", "version": "1.0.0"}

@app.get("/api/jobs")
def get_jobs(
    q: Optional[str] = Query(None, description="Search query for title, company, description, or tags"),
    location: Optional[str] = Query(None, description="Filter by location"),
    remote: Optional[str] = Query(None, description="Filter by remote status: 'yes', 'no', or 'any'"),
    job_type: Optional[str] = Query(None, description="Filter by job type: 'Full-time', 'Contract', 'Part-time', or 'any'"),
    sort: SortOrder = Query(SortOrder.newest, description="Sort order: 'newest' or 'oldest'"),
    page: int = Query(1, ge=1, description="Page number (starts at 1)"),
    page_size: int = Query(5, ge=1, le=100, description="Number of jobs per page")
):
    """
    Search and filter jobs with pagination
    
    Returns paginated job results with metadata
    """
    
    # Build Elasticsearch query
    must_conditions = []
    filter_conditions = []
    
    # Text search (multi-field search)
    if q:
        must_conditions.append({
            "multi_match": {
                "query": q,
                "fields": ["title^3", "company^2", "description", "tags^2"],
                "fuzziness": "AUTO",
                "operator": "or"
            }
        })
    
    # Location filter (case-insensitive match using text field)
    if location:
        must_conditions.append({
            "match_phrase": {
                "location": {
                    "query": location
                }
            }
        })
    
    # Remote filter
    if remote and remote.lower() != "any":
        filter_conditions.append({
            "term": {"remote": remote.lower() == "yes"}
        })
    
    # Job type filter
    if job_type and job_type.lower() != "any":
        filter_conditions.append({
            "wildcard": {
                "type.keyword": {
                    "value": job_type,
                    "case_insensitive": True
                }
            }
        })
    
    # Build final query
    if must_conditions or filter_conditions:
        query = {
            "bool": {
                "must": must_conditions,
                "filter": filter_conditions
            }
        }
    else:
        query = {"match_all": {}}
    
    # Sort order
    sort_order = [
        {"postedDate": {"order": "desc" if sort == SortOrder.newest else "asc"}}
    ]
    
    # If there's a text search, add relevance score as primary sort
    if q:
        sort_order.insert(0, {"_score": {"order": "desc"}})
    
    # Calculate pagination
    from_index = (page - 1) * page_size
    
    # Execute search
    try:
        es_client = get_es_client()
        response = es_client.search(
            index=INDEX_NAME,
            query=query,
            sort=sort_order,
            from_=from_index,
            size=page_size
        )
        
        # Extract results
        hits = response["hits"]["hits"]
        total = response["hits"]["total"]["value"]
        
        jobs = [hit["_source"] for hit in hits]
        
        # Calculate pagination metadata
        total_pages = (total + page_size - 1) // page_size  # Ceiling division
        
        return {
            "jobs": jobs,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
        
    except Exception as e:
        # Fallback to JSON file if Elasticsearch fails
        print(f"⚠ Elasticsearch error, using fallback job data: {e}")
        jobs = load_jobs()

        # Apply basic filtering, sorting, and pagination in fallback mode
        filtered_jobs = jobs

        # Text search (case-insensitive substring across key fields)
        if q:
            q_lower = q.lower()
            def matches_text(job):
                title = str(job.get("title", "")).lower()
                company = str(job.get("company", "")).lower()
                description = str(job.get("description", "")).lower()
                tags = job.get("tags", [])
                tags_text = " ".join(str(t) for t in tags).lower() if isinstance(tags, (list, tuple)) else str(tags).lower()
                return (
                    q_lower in title
                    or q_lower in company
                    or q_lower in description
                    or q_lower in tags_text
                )
            filtered_jobs = [job for job in filtered_jobs if matches_text(job)]

        # Location filter (case-insensitive substring match)
        if location:
            loc_lower = location.lower()
            filtered_jobs = [
                job for job in filtered_jobs
                if loc_lower in str(job.get("location", "")).lower()
            ]

        # Remote filter
        if remote and remote.lower() != "any":
            desired_remote = remote.lower() == "yes"
            filtered_jobs = [
                job for job in filtered_jobs
                if bool(job.get("remote", False)) == desired_remote
            ]

        # Job type filter
        if job_type and job_type.lower() != "any":
            filtered_jobs = [
                job for job in filtered_jobs
                if str(job.get("type", "")).lower() == job_type.lower()
            ]

        # Sort by postedDate (newest or oldest)
        reverse = sort == SortOrder.newest
        filtered_jobs.sort(key=lambda job: job.get("postedDate") or "", reverse=reverse)

        # Pagination
        total = len(filtered_jobs)
        total_pages = (total + page_size - 1) // page_size if page_size > 0 else 1
        from_index = (page - 1) * page_size
        to_index = from_index + page_size
        page_jobs = filtered_jobs[from_index:to_index] if page_size > 0 else filtered_jobs

        return {
            "jobs": page_jobs,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }

@app.get("/api/companies/{company_name}")
def get_company(company_name: str):
    """Return company metadata if available; falls back to derived info from jobs"""
    companies = load_companies()
    # Try exact match first (case-insensitive)
    for c in companies:
        if c.get("name", "").lower() == company_name.lower():
            return c

    # Fallback: derive from jobs data
    jobs = load_jobs()
    matches = [j for j in jobs if j.get("company", "").lower() == company_name.lower()]
    if not matches:
        raise HTTPException(status_code=404, detail="Company not found")

    # Derive a minimal company object
    locations = sorted({j.get("location") for j in matches if j.get("location")})
    tags = sorted({t for j in matches for t in j.get("tags", [])})
    logo = matches[0].get("logoUrl")
    location_text = ", ".join(locations[:2]) if locations else "multiple locations"
    overview = matches[0].get("companyOverview") or (
        f"{matches[0].get('company')} is a mission-driven company hiring across {location_text}."
    )
    return {
        "name": matches[0].get("company"),
        "overview": overview,
        "employees": None,
        "locations": locations,
        "tags": tags,
        "logoUrl": logo
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
