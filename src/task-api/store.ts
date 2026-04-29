import { randomUUID } from "node:crypto";

export type TaskStatus = "pending" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

const tasks = new Map<string, Task>();

export function listTasks(): Task[] {
  return Array.from(tasks.values());
}

export function getTask(id: string): Task | undefined {
  return tasks.get(id);
}

export function createTask(input: CreateTaskInput): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: randomUUID(),
    title: input.title,
    description: input.description,
    status: input.status ?? "pending",
    createdAt: now,
    updatedAt: now,
  };
  tasks.set(task.id, task);
  return task;
}

export function updateTask(id: string, input: UpdateTaskInput): Task | undefined {
  const task = tasks.get(id);
  if (!task) return undefined;
  const updated: Task = { ...task, ...input, updatedAt: new Date().toISOString() };
  tasks.set(id, updated);
  return updated;
}

export function deleteTask(id: string): boolean {
  return tasks.delete(id);
}
