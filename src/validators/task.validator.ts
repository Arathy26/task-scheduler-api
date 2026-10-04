// src/validators/task.validator.ts

export const VALID_STATUSES = ['NEW', 'IN_PROGRESS', 'PENDING', 'COMPLETED']

// ── UUID helper ───────────────────────────────────────────

export function isValidUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

// ── Create Task ───────────────────────────────────────────

export function validateCreateTask(body: unknown) {
  const errors: { field: string; message: string }[] = []

  if (!body || typeof body !== 'object') {
    return [{ field: 'body', message: 'Request body is required.' }]
  }

  const data = body as Record<string, unknown>

  // title
  if (!data.title || typeof data.title !== 'string') {
    errors.push({ field: 'title', message: 'Title is required.' })
  } else if (data.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title cannot be blank.' })
  } else if (data.title.trim().length > 200) {
    errors.push({ field: 'title', message: 'Title must be 200 characters or less.' })
  }

  // description
  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string.' })
    } else if (data.description.length > 5000) {
      errors.push({ field: 'description', message: 'Description must be 5000 characters or less.' })
    }
  }

  // scheduledAt
  if (data.scheduledAt !== undefined && data.scheduledAt !== null) {
    if (typeof data.scheduledAt !== 'string' || isNaN(Date.parse(data.scheduledAt))) {
      errors.push({ field: 'scheduledAt', message: 'scheduledAt must be a valid ISO 8601 date.' })
    }
  }

  // userId
  if (!data.userId || typeof data.userId !== 'string') {
    errors.push({ field: 'userId', message: 'userId is required.' })
  } else if (!isValidUUID(data.userId)) {
    errors.push({ field: 'userId', message: 'userId must be a valid UUID.' })
  }

  return errors
}

// ── Update Task ───────────────────────────────────────────

export function validateUpdateTask(body: unknown) {
  const errors: { field: string; message: string }[] = []

  if (!body || typeof body !== 'object') {
    return [{ field: 'body', message: 'Request body is required.' }]
  }

  const data = body as Record<string, unknown>

  if (Object.keys(data).length === 0) {
    return [{ field: 'body', message: 'At least one field is required.' }]
  }

  // title
  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Title cannot be blank.' })
    } else if (data.title.trim().length > 200) {
      errors.push({ field: 'title', message: 'Title must be 200 characters or less.' })
    }
  }

  // status
  if (data.status !== undefined) {
    if (!VALID_STATUSES.includes(data.status as string)) {
      errors.push({
        field: 'status',
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      })
    }
  }

  // scheduledAt
  if (data.scheduledAt !== undefined && data.scheduledAt !== null) {
    if (typeof data.scheduledAt !== 'string' || isNaN(Date.parse(data.scheduledAt))) {
      errors.push({ field: 'scheduledAt', message: 'scheduledAt must be a valid ISO 8601 date.' })
    }
  }

  // description
  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string.' })
    } else if (data.description.length > 5000) {
      errors.push({ field: 'description', message: 'Description must be 5000 characters or less.' })
    }
  }

  return errors
}

// ── Pagination ────────────────────────────────────────────

export function validatePagination(page: unknown, limit: unknown) {
  const errors: { field: string; message: string }[] = []

  const pageNum = Number(page)
  const limitNum = Number(limit)

  if (isNaN(pageNum) || pageNum < 1) {
    errors.push({ field: 'page', message: 'Page must be a positive number.' })
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    errors.push({ field: 'limit', message: 'Limit must be between 1 and 100.' })
  }

  return errors
}