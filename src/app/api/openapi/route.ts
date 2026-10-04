import { NextResponse } from 'next/server'

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Task Scheduler API',
    version: '1.0.0',
    description: 'A single-user task scheduler API',
  },
  paths: {
    '/api/tasks': {
      get: {
        summary: 'List all tasks',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['NEW', 'IN_PROGRESS', 'PENDING', 'COMPLETED'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { '200': { description: 'List of tasks' } },
      },
      post: {
        summary: 'Create a task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  scheduledAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Task created' } },
      },
    },
    '/api/tasks/{id}': {
      get: {
        summary: 'Get one task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Task found' }, '404': { description: 'Task not found' } },
      },
      patch: {
        summary: 'Update a task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string', enum: ['NEW', 'IN_PROGRESS', 'PENDING', 'COMPLETED'] },
                  scheduledAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Task updated' }, '404': { description: 'Task not found' } },
      },
      delete: {
        summary: 'Delete a task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Task deleted' }, '404': { description: 'Task not found' } },
      },
    },

    // ─── USER ENDPOINTS ───────────────────────────────────────
    '/api/users': {
      get: {
        summary: 'List all users',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { '200': { description: 'List of users' } },
      },
      post: {
        summary: 'Create a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User created' },
          '400': { description: 'Invalid input or email already exists' },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        summary: 'Get one user',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'User found' },
          '404': { description: 'User not found' },
        },
      },
      patch: {
        summary: 'Update a user',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'User updated' },
          '404': { description: 'User not found' },
        },
      },
      delete: {
        summary: 'Delete a user',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'User deleted' },
          '404': { description: 'User not found' },
        },
      },
    },
  },
}

export async function GET() {
  return NextResponse.json(openApiSpec)
}