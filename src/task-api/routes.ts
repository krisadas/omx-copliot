import { Hono } from "hono";
import type { CreateTaskInput, UpdateTaskInput } from "./store.js";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "./store.js";

export const taskRoutes = new Hono();

taskRoutes.get("/", (c) => {
  return c.json(listTasks());
});

taskRoutes.post("/", async (c) => {
  const body = await c.req.json<CreateTaskInput>();
  if (!body.title || typeof body.title !== "string") {
    return c.json({ error: "title is required" }, 400);
  }
  const task = createTask(body);
  return c.json(task, 201);
});

taskRoutes.get("/:id", (c) => {
  const task = getTask(c.req.param("id"));
  if (!task) return c.json({ error: "task not found" }, 404);
  return c.json(task);
});

taskRoutes.patch("/:id", async (c) => {
  const body = await c.req.json<UpdateTaskInput>();
  const task = updateTask(c.req.param("id"), body);
  if (!task) return c.json({ error: "task not found" }, 404);
  return c.json(task);
});

taskRoutes.delete("/:id", (c) => {
  const deleted = deleteTask(c.req.param("id"));
  if (!deleted) return c.json({ error: "task not found" }, 404);
  return c.body(null, 204);
});
