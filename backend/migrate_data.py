"""
Migration script to index jobs from JSON into Elasticsearch
Run this script once to populate Elasticsearch with job data
Usage: python migrate_data.py
"""

from elasticsearch import Elasticsearch, helpers
import json
import os

# Initialize Elasticsearch client
es = Elasticsearch(
    ['http://localhost:9200'],
    verify_certs=False,
    ssl_show_warn=False
)

INDEX_NAME = "jobs"

# Define index mapping
INDEX_MAPPING = {
    "mappings": {
        "properties": {
            "id": {"type": "keyword"},
            "title": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
            "company": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
            "location": {
                "type": "text",
                "fields": {
                    "keyword": {"type": "keyword"}
                },
                "analyzer": "standard"
            },
            "remote": {"type": "boolean"},
            "type": {"type": "keyword"},
            "salary": {"type": "text"},
            "postedDate": {"type": "date"},
            "description": {"type": "text"},
            "tags": {"type": "keyword"},
            "applyUrl": {"type": "keyword"},
            "logoUrl": {"type": "keyword"}
        }
    }
}

def migrate():
    """Migrate jobs from JSON to Elasticsearch"""
    
    # Check Elasticsearch connection
    if not es.ping():
        print("❌ Error: Cannot connect to Elasticsearch at http://localhost:9200")
        print("   Make sure Elasticsearch is running!")
        return
    
    print("✓ Connected to Elasticsearch")
    
    # Delete index if it exists (for clean migration)
    if es.indices.exists(index=INDEX_NAME):
        es.indices.delete(index=INDEX_NAME)
        print(f"✓ Deleted existing index '{INDEX_NAME}'")
    
    # Create index with mapping
    es.indices.create(index=INDEX_NAME, mappings=INDEX_MAPPING["mappings"])
    print(f"✓ Created index '{INDEX_NAME}' with mapping")
    
    # Load jobs from JSON
    json_path = os.path.join(os.path.dirname(__file__), "data", "jobs.json")
    with open(json_path, "r", encoding="utf-8") as f:
        jobs = json.load(f)
    
    print(f"✓ Loaded {len(jobs)} jobs from {json_path}")
    
    # Bulk index jobs using helpers.bulk for efficiency
    actions = [
        {
            "_index": INDEX_NAME,
            "_id": job["id"],
            "_source": job
        }
        for job in jobs
    ]
    
    success, failed = helpers.bulk(es, actions, raise_on_error=False, stats_only=False)
    indexed_count = success
    
    # Refresh index to make documents searchable immediately
    es.indices.refresh(index=INDEX_NAME)
    
    print(f"✓ Indexed {indexed_count} jobs into Elasticsearch")
    print(f"\n✅ Migration complete! Your jobs are now searchable.")

if __name__ == "__main__":
    migrate()
