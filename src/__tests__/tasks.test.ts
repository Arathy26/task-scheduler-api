import { TaskModel } from '../models/task.model'

// Clean up database before each test
beforeEach(async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  await prisma.task.deleteMany()
  await prisma.$disconnect()
})

describe('Task CRUD Operations', () => {
  // Test 1: Create a task
  it('should create a task with status NEW', async () => {
    const task = await TaskModel.create({
      title: 'Test Task',
      description: 'Test Description',
    })
    expect(task.title).toBe('Test Task')
    expect(task.status).toBe('NEW')
    expect(task.id).toBeDefined()
  })

  // Test 2: Get all tasks
  it('should return all tasks', async () => {
    await TaskModel.create({ title: 'Task 1' })
    await TaskModel.create({ title: 'Task 2' })
    const { tasks, total } = await TaskModel.findAll()
    expect(total).toBe(2)
    expect(tasks.length).toBe(2)
  })

  // Test 3: Filter by status
  it('should filter tasks by status', async () => {
    await TaskModel.create({ title: 'Task 1' })
    await TaskModel.create({ title: 'Task 2' })
    const { tasks } = await TaskModel.findAll('NEW')
    expect(tasks.length).toBe(2)
    tasks.forEach(task => {
      expect(task.status).toBe('NEW')
    })
  })

  // Test 4: Get task by ID
  it('should get a task by ID', async () => {
    const created = await TaskModel.create({ title: 'Find Me' })
    const found = await TaskModel.findById(created.id)
    expect(found).not.toBeNull()
    expect(found!.title).toBe('Find Me')
  })

  // Test 5: Update task status
  it('should update task status to IN_PROGRESS', async () => {
    const task = await TaskModel.create({ title: 'Update Me' })
    const updated = await TaskModel.update(task.id, { status: 'IN_PROGRESS' })
    expect(updated!.status).toBe('IN_PROGRESS')
  })

  // Test 6: Completion timestamp
  it('should set completedAt when status is COMPLETED', async () => {
    const task = await TaskModel.create({ title: 'Complete Me' })
    const updated = await TaskModel.update(task.id, { status: 'COMPLETED' })
    expect(updated!.completedAt).not.toBeNull()
  })

  // Test 7: Clear completedAt when leaving COMPLETED
  it('should clear completedAt when leaving COMPLETED status', async () => {
    const task = await TaskModel.create({ title: 'Uncomplete Me' })
    await TaskModel.update(task.id, { status: 'COMPLETED' })
    const updated = await TaskModel.update(task.id, { status: 'IN_PROGRESS' })
    expect(updated!.completedAt).toBeNull()
  })

  // Test 8: Delete task
  it('should delete a task', async () => {
    const task = await TaskModel.create({ title: 'Delete Me' })
    await TaskModel.delete(task.id)
    const found = await TaskModel.findById(task.id)
    expect(found).toBeNull()
  })

  // Test 9: Return null for missing task
  it('should return null for non-existent task', async () => {
    const found = await TaskModel.findById('non-existent-id')
    expect(found).toBeNull()
  })
})