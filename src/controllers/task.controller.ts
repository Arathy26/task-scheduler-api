// src/controllers/task.controller.ts

import { NextRequest, NextResponse } from 'next/server'
import { TaskService } from '../services/task.service'
import {
  validateCreateTask,
  validateUpdateTask,
  validatePagination,
} from '../validators/task.validator'

function errorResponse(
  code: string,
  message: string,
  details: { field: string; message: string }[] = [],
  status: number
) {
  return NextResponse.json(
    { error: { code, message, details } },
    { status }
  )
}

export const TaskController = {

  async create(req: NextRequest) {
    try {
      const body = await req.json()

      const errors = validateCreateTask(body)
      if (errors.length > 0) {
        return errorResponse(
          'VALIDATION_ERROR',
          'The request contains invalid values.',
          errors,
          400
        )
      }

      const task = await TaskService.createTask(body)
      return NextResponse.json(task, { status: 201 })

    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
        return errorResponse(
          'NOT_FOUND',
          'User not found.',
          [{ field: 'userId', message: 'User not found.' }],
          404
        )
      }
      console.error('TaskController.create error:', error)
      return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred.', [], 500)
    }
  },

  async getAll(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)

      const status = searchParams.get('status') || undefined
      const userId = searchParams.get('userId') || undefined
      const page = searchParams.get('page') || '1'
      const limit = searchParams.get('limit') || '20'

      const paginationErrors = validatePagination(page, limit)
      if (paginationErrors.length > 0) {
        return errorResponse(
          'VALIDATION_ERROR',
          'Invalid pagination parameters.',
          paginationErrors,
          400
        )
      }

      const { tasks, total } = await TaskService.getAllTasks(
        status,
        userId,
        Number(page),
        Number(limit)
      )

      return NextResponse.json({
        data: tasks,
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      })

    } catch {
      return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred.', [], 500)
    }
  },

  async getOne(req: NextRequest, id: string) {
    try {
      const task = await TaskService.getTaskById(id)
      return NextResponse.json(task)

    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'TASK_NOT_FOUND') {
        return errorResponse('NOT_FOUND', 'Task not found.', [], 404)
      }
      return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred.', [], 500)
    }
  },

  async update(req: NextRequest, id: string) {
    try {
      const body = await req.json()

      const errors = validateUpdateTask(body)
      if (errors.length > 0) {
        return errorResponse(
          'VALIDATION_ERROR',
          'The request contains invalid values.',
          errors,
          400
        )
      }

      const task = await TaskService.updateTask(id, body)
      return NextResponse.json(task)

    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'TASK_NOT_FOUND') {
        return errorResponse('NOT_FOUND', 'Task not found.', [], 404)
      }
      return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred.', [], 500)
    }
  },

  async delete(req: NextRequest, id: string) {
    try {
      await TaskService.deleteTask(id)
      return new NextResponse(null, { status: 204 })

    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'TASK_NOT_FOUND') {
        return errorResponse('NOT_FOUND', 'Task not found.', [], 404)
      }
      return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred.', [], 500)
    }
  },
}