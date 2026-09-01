import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/server.js";

let server;
let base;

before(async () => {
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  base = `http://127.0.0.1:${port}`;
});

after(() => {
  server?.close();
});

test("health endpoint reports ok", async () => {
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "ok");
});

test("seeded todos are returned", async () => {
  const res = await fetch(`${base}/api/todos`);
  assert.equal(res.status, 200);
  const todos = await res.json();
  assert.ok(Array.isArray(todos));
  assert.ok(todos.length >= 2);
});

test("create, toggle, and delete a todo end to end", async () => {
  const createRes = await fetch(`${base}/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Write integration test" }),
  });
  assert.equal(createRes.status, 201);
  const created = await createRes.json();
  assert.equal(created.title, "Write integration test");
  assert.equal(created.done, false);

  const patchRes = await fetch(`${base}/api/todos/${created.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: true }),
  });
  assert.equal(patchRes.status, 200);
  const patched = await patchRes.json();
  assert.equal(patched.done, true);

  const delRes = await fetch(`${base}/api/todos/${created.id}`, { method: "DELETE" });
  assert.equal(delRes.status, 204);

  const missingRes = await fetch(`${base}/api/todos/${created.id}`, { method: "DELETE" });
  assert.equal(missingRes.status, 404);
});

test("rejects an empty title", async () => {
  const res = await fetch(`${base}/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "   " }),
  });
  assert.equal(res.status, 400);
});
