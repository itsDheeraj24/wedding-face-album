# Wedding Album Face Recognizer

## Description
This project is a full-stack web app that allows users to upload wedding photos, automatically groups photos by faces, and supports subscription plans.

## How to Run Locally

### Requirements
- Docker and Docker Compose installed

### Run
```bash
docker-compose up --build
```

Frontend will be available at http://localhost:3000  
Backend API will be available at http://localhost:8000

---

## Project Structure
- `backend/`: FastAPI backend with face recognition
- `frontend/`: React frontend using Vite
- `docker-compose.yml`: To run both services together