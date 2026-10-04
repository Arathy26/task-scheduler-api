# Task Scheduler API

A single-user, headless REST API for managing tasks. It supports creating, retrieving, listing, filtering, updating and deleting tasks, with status tracking, pagination and optional scheduling.

Built with **Next.js (App Router)**, **TypeScript**, **Prisma ORM** and **PostgreSQL**, and documented with **OpenAPI / Swagger UI**.

---

## Features

- Full CRUD for tasks
- Four task statuses: `NEW`, `IN_PROGRESS`, `PENDING`, `COMPLETED`
- Filter tasks by status
- Pagination with metadata (`page`, `limit`, `total`, `totalPages`)
- Optional scheduled date and time (`scheduledAt`)
- Automatic completion timestamp (`completedAt`)
- Input validation with consistent error responses
- Interactive API documentation at `/docs`

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js (App Router), TypeScript |
| Database | PostgreSQL |
| ORM | Prisma (with versioned migrations) |
| API documentation | OpenAPI + Swagger UI |
| Local database | Docker Compose |

---

## Architecture

The project follows MVC adapted for a headless REST API, with each layer having a single responsibility:

```
Client / Swagger UI
        ↓
Route Handler      → receives the HTTP request and delegates
        ↓
Controller         → coordinates the request and response
        ↓
Service            → business rules (status and completedAt logic)
        ↓
Model / Data Access → database operations through Prisma
        ↓
PostgreSQL
```

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database model
│   └── migrations/            # Versioned database migrations
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── tasks/
│   │   │   │   ├── route.ts         # POST /api/tasks, GET /api/tasks
│   │   │   │   └── [id]/route.ts    # GET, PATCH, DELETE /api/tasks/{id}
│   │   │   └── openapi/route.ts     # OpenAPI specification
│   │   └── docs/page.tsx            # Swagger UI
│   ├── controllers/           # Request coordination
│   ├── services/              # Business rules
│   ├── models/                # Data access
│   ├── validators/            # Input validation
│   └── lib/                   # Shared utilities
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js (LTS) and npm
- Docker Desktop

### 1. Clone and install

```bash
git clone <repository-url>
cd <repository-folder>
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Set the database connection string in `.env`:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database>"
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Start the server

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

### 6. Open the API documentation

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI specification: `http://localhost:3000/api/openapi`

### 7. Run tests

```bash
npm test
```

---

## API Endpoints

| Method | Endpoint | Description | Success |
| --- | --- | --- | --- |
| `POST` | `/api/tasks` | Create a task | `201 Created` |
| `GET` | `/api/tasks` | List tasks (filter + pagination) | `200 OK` |
| `GET` | `/api/tasks/{id}` | Get a task by ID | `200 OK` |
| `PATCH` | `/api/tasks/{id}` | Partially update a task | `200 OK` |
| `DELETE` | `/api/tasks/{id}` | Delete a task | `204 No Content` |

### Query parameters for `GET /api/tasks`

| Parameter | Description |
| --- | --- |
| `status` | Filter by `NEW`, `IN_PROGRESS`, `PENDING` or `COMPLETED` |
| `page` | Page number |
| `limit` | Number of tasks per page |

Results are ordered newest first, with ID as a secondary sort.

### Example — create a task

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Learn PostgreSQL migrations",
  "description": "Create and apply the initial task migration",
  "scheduledAt": "2026-10-01T09:00:00Z"
}
```

### Example — update status

```http
PATCH /api/tasks/{id}
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

In a `PATCH` request, omitted fields stay unchanged and an explicit `null` clears an optional field.

---

## Task Model

| Field | Type | Rules |
| --- | --- | --- |
| `id` | UUID | Auto-generated primary key |
| `title` | String | Required, 1–200 characters after trimming |
| `description` | Text | Optional, max 5,000 characters |
| `status` | Enum | `NEW`, `IN_PROGRESS`, `PENDING`, `COMPLETED`; defaults to `NEW` |
| `scheduledAt` | Timestamp | Optional planned date/time |
| `completedAt` | Timestamp | Managed automatically |
| `createdAt` | Timestamp | Set on creation |
| `updatedAt` | Timestamp | Updated on every change |

All timestamps use ISO 8601 UTC format.

### Completion timestamp rules

- Moving a task **into** `COMPLETED` sets `completedAt`.
- Moving a task **out of** `COMPLETED` clears `completedAt`.
- Updating other fields of a completed task keeps the existing `completedAt`.

Any status can move to any other status.

---

## Error Handling

All errors use a consistent format:

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

| Status | When |
| --- | --- |
| `400 Bad Request` | Invalid input, malformed UUID, invalid pagination, unsupported fields or empty update |
| `404 Not Found` | Task does not exist |
| `500 Internal Server Error` | Unexpected failure (no internal details are exposed) |

---

## Out of Scope

This version does not include authentication, multiple users, notifications, recurring tasks or automatic task execution. `scheduledAt` only stores the planned date and time.
