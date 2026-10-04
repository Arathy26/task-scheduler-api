// src/services/user.service.ts

import { UserModel, CreateUserInput, UpdateUserInput } from '@/models/user.model'

export const UserService = {

  async createUser(data: CreateUserInput) {
    const existing = await UserModel.findByEmail(
      data.email.trim().toLowerCase()
    )
    if (existing) {
      throw new Error('EMAIL_TAKEN')
    }
    return UserModel.create({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
    })
  },

  async getAllUsers(page = 1, limit = 20) {
    return UserModel.findAll(page, limit)
  },

  async getUserById(id: string) {
    const user = await UserModel.findById(id)
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }
    return user
  },

  async updateUser(id: string, data: UpdateUserInput) {
    const user = await UserModel.findById(id)
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }
    if (data.email) {
      const normalizedEmail = data.email.trim().toLowerCase()
      if (normalizedEmail !== user.email) {
        const existing = await UserModel.findByEmail(normalizedEmail)
        if (existing) {
          throw new Error('EMAIL_TAKEN')
        }
      }
    }
    return UserModel.update(id, {
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
    })
  },

  async deleteUser(id: string) {
    const user = await UserModel.findById(id)
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }
    return UserModel.delete(id)
  },
}