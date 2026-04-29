import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { taskRoutes } from "./routes.js";

const app = new Hono();

app.route("/tasks", taskRoutes);

app.get("/health", (c) => c.json({ status: "ok" }));

const port = Number(process.env.PORT ?? 3000);

console.log(`Task API listening on http://localhost:${port}`);

serve({ fetch: app.fetch, port });
