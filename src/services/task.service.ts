// src/services/task.service.ts

import { TaskModel, CreateTaskInput, UpdateTaskInput } from '@/models/task.model'
import { UserModel } from '@/models/user.model'
import { TaskStatus } from '@prisma/client'

export const TaskService = {

  async createTask(data: CreateTaskInput) {
    const user = await UserModel.findById(data.userId)
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }
    return TaskModel.create(data)
  },

  async getAllTasks(
    status?: string,
    userId?: string,
    page = 1,
    limit = 20
  ) {
    const validStatus = status as TaskStatus | undefined
    return TaskModel.findAll(validStatus, userId, page, limit)
  },

  async getTaskById(id: string) {
    const task = await TaskModel.findById(id)
    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }
    return task
  },

  async updateTask(id: string, data: UpdateTaskInput) {
    const task = await TaskModel.findById(id)
    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    let completedAt = task.completedAt

    if (data.status === 'COMPLETED' && task.status !== 'COMPLETED') {
      completedAt = new Date()
    }

    if (
      data.status &&
      data.status !== 'COMPLETED' &&
      task.status === 'COMPLETED'
    ) {
      completedAt = null
    }

    return TaskModel.update(id, {
      ...data,
      completedAt,
    })
  },

  async deleteTask(id: string) {
    const task = await TaskModel.findById(id)
    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }
    return TaskModel.delete(id)
  },
}