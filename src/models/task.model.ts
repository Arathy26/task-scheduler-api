// src/models/task.model.ts

import { prisma } from '@/lib/prisma'
import { TaskStatus } from '@prisma/client'

export interface CreateTaskInput {
  title: string
  description?: string | null
  scheduledAt?: string | null
  userId: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  scheduledAt?: string | null
  status?: TaskStatus
  completedAt?: Date | null
}

export const TaskModel = {

  async create(data: CreateTaskInput) {
    return prisma.task.create({
      data: {
        title: data.title.trim(),
        description: data.description ?? null,
        scheduledAt: data.scheduledAt
          ? new Date(data.scheduledAt)
          : null,
        userId: data.userId,
      },
      include: { user: true },
    })
  },

  async findAll(
    status?: TaskStatus,
    userId?: string,
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit
    const where = {
      ...(status && { status }),
      ...(userId && { userId }),
    }
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip,
        take: limit,
        include: { user: true },
      }),
      prisma.task.count({ where }),
    ])
    return { tasks, total }
  },

  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: { user: true },
    })
  },

  async update(id: string, data: UpdateTaskInput) {
    return prisma.task.update({
      where: { id },
      data: {
        ...data,
        scheduledAt:
          data.scheduledAt === null
            ? null
            : data.scheduledAt
            ? new Date(data.scheduledAt)
            : undefined,
      },
      include: { user: true },
    })
  },

  async delete(id: string) {
    return prisma.task.delete({
      where: { id },
    })
  },
}