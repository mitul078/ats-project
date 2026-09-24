# ATS Project

ATS Project is a backend service for managing job postings, candidate applications, and resume screening. It exposes a REST API for recruiters and candidates, supports JWT authentication, file upload for PDF resumes, and uses a background queue plus AI-based resume scoring.

## Features

- Recruiter authentication and role-based access
- Candidate login and profile lookup
- Job creation and listing
- Candidate resume submission with PDF upload
- Background resume parsing and scoring using BullMQ + Redis
- AI-based extraction and fit scoring via Groq
- MongoDB-backed data storage
- Docker setup for local orchestration

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Redis + BullMQ
- JWT authentication
- Multer for PDF uploads
- Groq SDK for AI processing

## Project Structure

```text
.
├── src/
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── queues/
│   ├── routes/
│   ├── seeds/
│   ├── services/
│   ├── tests/
│   ├── utils/
│   └── validators/
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.worker
├── nginx.conf
├── server.js
├── worker.js
├── package.json
└── api-collection.json
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- MongoDB instance running
- Redis instance running
- Groq API key

## Environment Variables

Create a `.env` file in the project root with values similar to the following:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/ats-project
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
REDIS_URI=redis://localhost:6379
GROQ_API_KEY=your_groq_api_key
```

## Installation

```bash
npm install
```

## Seed Default Users

The project includes seeded users for testing:

- Recruiter: `recruiter@ats.com` / `Recruiter@123`
- Candidate: `candidate1@ats.com` / `Candidate@123`

```bash
npm run seed
```

## Run the Application

Start the API server:

```bash
npm run dev
```

Start the resume worker:

```bash
npm run worker
```

The API runs on `http://localhost:4000` by default.

## Docker Setup

You can also run the service using Docker Compose.

```bash
docker compose up --build
```

This starts the API, Redis, worker, and nginx reverse proxy.

## API Endpoints

### Authentication

- `POST /api/auth/login` — Login and receive a JWT token
- `GET /api/auth/me` — Get current user details (authenticated)

### Jobs

- `POST /api/jobs` — Create a job posting (recruiter only)
- `GET /api/jobs` — List open jobs (authenticated)
- `GET /api/jobs/:id` — Get a job by ID (authenticated)

### Applications

- `POST /api/applications` — Submit a candidate application with resume PDF (candidate only)
- `GET /api/applications/:id` — Get an application by ID (authenticated)
- `GET /api/applications/job/:jobId` — Get all applications for a job (recruiter only)

### Health Check

- `GET /health` — Server health status

## Authentication

Protected routes expect a bearer token in the `Authorization` header:

```http
Authorization: Bearer <jwt_token>
```

## API Collection

A ready-to-import Postman collection is included at `api-collection.json`.

## Example Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@ats.com",
    "password": "Recruiter@123"
  }'
```

## Notes

- Resume uploads are expected to be PDF files.
- Candidate applications are processed in the background and scored asynchronously.
- Redis must be available for the queue and worker to function correctly.
