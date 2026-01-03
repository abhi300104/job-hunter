# Job Hunter Backend

Python FastAPI backend for the Job Hunter application.

## Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000

## API Endpoints

- `GET /` - Root endpoint (API info)
- `GET /api/jobs` - Get all jobs
- `GET /health` - Health check

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
