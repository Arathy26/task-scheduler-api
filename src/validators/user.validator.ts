// src/validators/user.validator.ts

import { z } from 'zod'

// ─── Schemas ────────────────────────────────────────────

const CreateUserSchema = z.object({
  name: z
    .string({ required_error: 'Name is required.' })
    .min(1, 'Name is required.')
    .max(100, 'Name must not exceed 100 characters.')
    .transform(val => val.trim()),

  email: z
    .string({ required_error: 'Email is required.' })
    .email('Must be a valid email address.')
    .transform(val => val.trim().toLowerCase()),
})

const UpdateUserSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name cannot be empty.')
      .max(100, 'Name must not exceed 100 characters.')
      .transform(val => val.trim())
      .optional(),

    email: z
      .string()
      .email('Must be a valid email address.')
      .transform(val => val.trim().toLowerCase())
      .optional(),
  })
  .refine(
    data => Object.keys(data).length > 0,
    { message: 'At least one field must be provided.' }
  )

// ─── Exported Types ──────────────────────────────────────

export type CreateUserData = z.infer<typeof CreateUserSchema>
export type UpdateUserData = z.infer<typeof UpdateUserSchema>

// ─── Exported Validators ─────────────────────────────────

export function validateCreateUser(body: unknown): CreateUserData {
  const result = CreateUserSchema.safeParse(body)

  if (!result.success) {
    const details = result.error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    throw { code: 'VALIDATION_ERROR', details }
  }

  return result.data
}

export function validateUpdateUser(body: unknown): UpdateUserData {
  const result = UpdateUserSchema.safeParse(body)

  if (!result.success) {
    const details = result.error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    throw { code: 'VALIDATION_ERROR', details }
  }

  return result.data
}