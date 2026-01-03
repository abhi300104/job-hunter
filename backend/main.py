from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI(title="Job Hunter API", version="1.0.0")

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
def get_jobs():
    """Get all jobs"""
    jobs = load_jobs()
    
    return jobs

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
