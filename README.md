# Task Scheduler API

A simple task management REST API built with Nest.js, PostgreSQL, and Prisma. This API allows you to create, update, track, and delete tasks.

---

## What is this project?

Imagine you have a to-do list app — but instead of buttons and a screen, everything is controlled through API calls. This project is exactly that. It is a **headless API** (no frontend/UI) that manages tasks.

---

## Technology Used

| Technology | What it does |
|------------|-------------|
| Next.js | The main framework that runs our server |
| TypeScript | Makes JavaScript safer by adding types |
| PostgreSQL | The database that stores our tasks |
| Prisma | Helps us talk to the database easily |
| Docker | Runs PostgreSQL in an isolated container |
| Swagger UI | A visual interface to test our API |

---

## Project Architecture (MVC)

This project follows the **MVC pattern** (Model, View, Controller):
Request comes in
↓
Route Handler (receives the request)
↓
Controller (decides what to do)
↓
Service (applies business rules)
↓
Model (talks to database)
↓
Response goes back

### Folder Structure
src/
app/
api/
tasks/
route.ts → Receives GET and POST requests
tasks/[id]/
route.ts → Receives GET, PATCH, DELETE requests
openapi/
route.ts → Serves the API documentation
docs/
page.tsx → Swagger UI page
controllers/
task.controller.ts → Handles request and response logic
services/
task.service.ts → Contains business rules
models/
task.model.ts → Talks to the database
validators/
task.validator.ts → Validates incoming data
lib/
prisma.ts → Database connection
prisma/
schema.prisma → Database table definition
migrations/ → Database change history




---

## Task Data Model

Each task has these fields:

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique ID, generated automatically |
| title | String | Required, max 200 characters |
| description | Text | Optional, max 5000 characters |
| status | Enum | NEW, IN_PROGRESS, PENDING, COMPLETED |
| scheduledAt | Timestamp | Optional planned date and time |
| completedAt | Timestamp | Set automatically when status is COMPLETED |
| createdAt | Timestamp | Set automatically when task is created |
| updatedAt | Timestamp | Updated automatically when task changes |

---

## Installation Guide

### Step 1 — Requirements

Make sure you have these installed:
- Node.js (v18 or higher)
- Docker Desktop
- Git

### Step 2 — Clone the project

```bash
git clone <your-repo-url>
cd task-scheduler-api
```

### Step 3 — Install dependencies

```bash
npm install
```

### Step 4 — Setup environment variables

```bash
cp .env.example .env
```

Open `.env` and update if needed:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskscheduler?schema=public"


### Step 5 — Start the database

Make sure Docker Desktop is running, then:

```bash
docker-compose up -d
```

You should see: Container taskscheduler_db Started

### Step 6 — Run database migrations

```bash
npx prisma migrate dev
```

This creates the tasks table in your database.

### Step 7 — Start the server

```bash
npm run dev
```

You should see: Ready on http://localhost:3000


---

## Testing the API

### Using Swagger UI (Recommended)

Open your browser and go to: http://localhost:3000/docs


You will see all the API endpoints. Click on any endpoint and click **"Try it out"** to test it.

### API Endpoints

| Method | Endpoint | What it does |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create a new task |
| GET | /api/tasks/{id} | Get one task by ID |
| PATCH | /api/tasks/{id} | Update a task |
| DELETE | /api/tasks/{id} | Delete a task |

### Example: Create a task

```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Learn Prisma",
  "description": "Learn how Prisma ORM works",
  "scheduledAt": "2026-10-01T09:00:00Z"
}
```

### Example: Filter tasks by status

GET /api/tasks?status=PENDING
GET /api/tasks?status=COMPLETED&page=1&limit=10


### Example: Update task status

```bash
PATCH /api/tasks/{id}
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

---

## Task Status Flow
NEW → IN_PROGRESS → PENDING → COMPLETED

- **NEW** → Task just created
- **IN_PROGRESS** → Work has started
- **PENDING** → Waiting or blocked
- **COMPLETED** → Task finished (completedAt is set automatically)

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid values.",
    "details": [
      {
        "field": "title",
        "message": "Title is required."
      }
    ]
  }
}
```

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created successfully |
| 204 | Deleted successfully |
| 400 | Invalid input |
| 404 | Task not found |
| 500 | Server error |

---

## Stopping the project

Stop the server: ctrl+c

Stop the database:
```bash
docker-compose down
```