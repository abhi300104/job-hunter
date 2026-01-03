# Job Hunter

A full-stack job listing application with a React frontend (Vite + Tailwind) and FastAPI backend.

## Project Overview

Job Hunter consists of two main components:
- **Frontend**: A modern React application built with Vite and styled with Tailwind CSS
- **Backend**: A Python FastAPI server providing job listing APIs

## Frontend Setup

### Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm run dev
```

Open the app at: http://localhost:5173/

3. Build for production:

```bash
npm run build
```

4. Preview the production build locally:

```bash
npm run preview
```

> **Note for Windows users**: If you encounter an error like "cannot be loaded because running scripts is disabled" when running `npm create` or other scripts from PowerShell, try running: 
>
> ```powershell
> Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

### Frontend Project Structure

- `index.html` — app entry
- `src/main.jsx` — app bootstrap
- `src/App.jsx` — main app component
- `src/components/` — UI components
- `src/data/jobs.json` — sample job data
- `src/styles/index.css` — Tailwind CSS entry

## Backend Setup

### Prerequisites

- Python 3.7+
- pip

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000

### API Endpoints

- `GET /` - Root endpoint (API info)
- `GET /api/jobs` - Get all jobs
- `GET /health` - Health check

### API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Running the Full Stack

1. **Start the Backend** (Terminal 1):
```bash
cd backend
venv\Scripts\activate  # Windows (or source venv/bin/activate for macOS/Linux)
uvicorn main:app --reload --port 8000
```

2. **Start the Frontend** (Terminal 2):
```bash
npm install  # if not already done
npm run dev
```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Next Steps

- Implement filters, sorting, and accessibility improvements
- Add user authentication
- Enhance job search capabilities
- Add job application tracking

---

**License**: MIT
