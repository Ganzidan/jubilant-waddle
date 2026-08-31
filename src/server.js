import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

export function createApp() {
  const app = express();
  app.use(express.json());

  // In-memory data store. Kept simple on purpose: the goal is a runnable,
  // demonstrable end-to-end flow, not durable persistence.
  let nextId = 1;
  const todos = new Map();

  const seed = (title) => {
    const todo = { id: nextId++, title, done: false, createdAt: Date.now() };
    todos.set(todo.id, todo);
    return todo;
  };
  seed("Set up the Cloud Agent environment");
  seed("Run the app end to end");

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.get("/api/todos", (_req, res) => {
    const list = [...todos.values()].sort((a, b) => a.createdAt - b.createdAt);
    res.json(list);
  });

  app.post("/api/todos", (req, res) => {
    const title = (req.body?.title ?? "").toString().trim();
    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }
    const todo = { id: nextId++, title, done: false, createdAt: Date.now() };
    todos.set(todo.id, todo);
    res.status(201).json(todo);
  });

  app.patch("/api/todos/:id", (req, res) => {
    const id = Number(req.params.id);
    const todo = todos.get(id);
    if (!todo) return res.status(404).json({ error: "not found" });
    if (typeof req.body?.done === "boolean") todo.done = req.body.done;
    if (typeof req.body?.title === "string" && req.body.title.trim()) {
      todo.title = req.body.title.trim();
    }
    res.json(todo);
  });

  app.delete("/api/todos/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!todos.has(id)) return res.status(404).json({ error: "not found" });
    todos.delete(id);
    res.status(204).end();
  });

  app.use(express.static(path.join(__dirname, "..", "public")));

  return app;
}

// Only start listening when run directly (not when imported by tests).
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const app = createApp();
  app.listen(PORT, HOST, () => {
    console.log(`jubilant-waddle listening on http://${HOST}:${PORT}`);
  });
}
