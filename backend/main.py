from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from elasticsearch import Elasticsearch
from typing import Optional
import json
import os

app = FastAPI(title="Job Hunter API", version="1.0.0")

# Initialize Elasticsearch client
es = Elasticsearch(
    ['http://localhost:9200'],
    # Disable SSL verification for local development
    verify_certs=False,
    ssl_show_warn=False
)

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

@app.get("/")
def root():
    """Root endpoint"""
    return {"message": "Job Hunter API", "version": "1.0.0"}

@app.get("/api/jobs")
def get_jobs(
    q: Optional[str] = Query(None, description="Search query for title, company, description, or tags"),
    location: Optional[str] = Query(None, description="Filter by location"),
    remote: Optional[str] = Query(None, description="Filter by remote status: 'yes', 'no', or 'any'"),
    type: Optional[str] = Query(None, description="Filter by job type: 'Full-time', 'Contract', 'Part-time', or 'any'"),
    sort: Optional[str] = Query("newest", description="Sort order: 'newest' or 'oldest'"),
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
    
    # Location filter (case-insensitive substring match)
    if location:
        must_conditions.append({
            "wildcard": {
                "location.keyword": {
                    "value": f"*{location}*",
                    "case_insensitive": True
                }
            }
        })
    
    # Remote filter
    if remote and remote.lower() != "any":
        filter_conditions.append({
            "term": {"remote": remote.lower() == "yes"}
        })
    
    # Job type filter
    if type and type.lower() != "any":
        filter_conditions.append({
            "term": {"type.keyword": type}
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
        {"postedDate": {"order": "desc" if sort == "newest" else "asc"}}
    ]
    
    # If there's a text search, add relevance score as primary sort
    if q:
        sort_order.insert(0, {"_score": {"order": "desc"}})
    
    # Calculate pagination
    from_index = (page - 1) * page_size
    
    # Execute search
    try:
        response = es.search(
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
        print(f"Elasticsearch error: {e}")
        jobs = load_jobs()
        
        # Simple fallback (return all jobs without pagination)
        return {
            "jobs": jobs,
            "total": len(jobs),
            "page": 1,
            "page_size": len(jobs),
            "total_pages": 1,
            "has_next": False,
            "has_prev": False
        }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
