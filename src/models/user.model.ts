// src/models/user.model.ts

import { prisma } from '@/lib/prisma'

export interface CreateUserInput {
  name: string
  email: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
}

export const UserModel = {

  async create(data: CreateUserInput) {
    return prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
      },
    })
  },

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ])
    return { users, total }
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    })
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  },

  async update(id: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id },
      data: {
        name: data.name?.trim(),
        email: data.email?.trim().toLowerCase(),
      },
    })
  },

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    })
  },
}