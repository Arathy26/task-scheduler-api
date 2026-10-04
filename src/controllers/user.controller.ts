// src/controllers/user.controller.ts

import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '../services/user.service'

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

export const UserController = {

  // POST /api/users
  async create(req: NextRequest) {
    try {
      const body = await req.json()
      const user = await UserService.createUser(body)
      return NextResponse.json(user, { status: 201 })

    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'EMAIL_TAKEN') {
        return errorResponse(
          'CONFLICT_ERROR',
          'A user with this email already exists.',
          [{ field: 'email', message: 'Email already exists.' }],
          409
        )
      }
      if (error instanceof Error && error.message === 'VALIDATION_ERROR') {
        return errorResponse(
          'VALIDATION_ERROR',
          'The request contains invalid values.',
          [],
          400
        )
      }
      console.error('UserController.create error:', error)
      return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred.', [], 500)
    }
  },

  // GET /api/users
  async getAll(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const page = Number(searchParams.get('page') || '1')
      const limit = Number(searchParams.get('limit') || '20')

      const { users, total } = await UserService.getAllUsers(page, limit)

      return NextResponse.json({
        data: users,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      })

    } catch {
      return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred.', [], 500)
    }
  },

  // GET /api/users/{id}
  async getOne(req: NextRequest, id: string) {
    try {
      const user = await UserService.getUserById(id)
      return NextResponse.json(user)

    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
        return errorResponse('NOT_FOUND', 'User not found.', [], 404)
      }
      return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred.', [], 500)
    }
  },

  // PATCH /api/users/{id}
  async update(req: NextRequest, id: string) {
    try {
      const body = await req.json()

      if (!body || Object.keys(body).length === 0) {
        return errorResponse(
          'VALIDATION_ERROR',
          'The request contains invalid values.',
          [{ field: 'body', message: 'At least one field is required.' }],
          400
        )
      }

      const user = await UserService.updateUser(id, body)
      return NextResponse.json(user)

    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
        return errorResponse('NOT_FOUND', 'User not found.', [], 404)
      }
      if (error instanceof Error && error.message === 'EMAIL_TAKEN') {
        return errorResponse(
          'CONFLICT_ERROR',
          'A user with this email already exists.',
          [{ field: 'email', message: 'Email already exists.' }],
          409
        )
      }
      return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred.', [], 500)
    }
  },

  // DELETE /api/users/{id}
  async delete(req: NextRequest, id: string) {
    try {
      await UserService.deleteUser(id)
      return new NextResponse(null, { status: 204 })

    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
        return errorResponse('NOT_FOUND', 'User not found.', [], 404)
      }
      return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred.', [], 500)
    }
  },
}