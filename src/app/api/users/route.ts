import { NextRequest } from 'next/server'
import { UserController } from '@/controllers/user.controller'

export async function GET(req: NextRequest) {
  return UserController.getAll(req)
}

export async function POST(req: NextRequest) {
  return UserController.create(req)
}