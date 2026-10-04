import { NextRequest } from 'next/server'
import { TaskController } from '@/controllers/task.controller'

export async function GET(req: NextRequest) {
  return TaskController.getAll(req)
}

export async function POST(req: NextRequest) {
  return TaskController.create(req)
}