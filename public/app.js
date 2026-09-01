const listEl = document.getElementById("todo-list");
const emptyEl = document.getElementById("empty");
const countEl = document.getElementById("count");
const formEl = document.getElementById("new-todo-form");
const inputEl = document.getElementById("new-todo-input");
const clearBtn = document.getElementById("clear-done");

async function api(path, options) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

function render(todos) {
  listEl.innerHTML = "";
  const remaining = todos.filter((t) => !t.done).length;
  countEl.textContent = `${remaining} item${remaining === 1 ? "" : "s"} left`;
  emptyEl.hidden = todos.length > 0;

  for (const todo of todos) {
    const li = document.createElement("li");
    li.className = `todo${todo.done ? " todo--done" : ""}`;
    li.dataset.id = todo.id;

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "todo__check";
    check.checked = todo.done;
    check.setAttribute("aria-label", `Mark "${todo.title}" as done`);
    check.addEventListener("change", () => toggle(todo, check.checked));

    const title = document.createElement("span");
    title.className = "todo__title";
    title.textContent = todo.title;

    const del = document.createElement("button");
    del.className = "todo__delete";
    del.type = "button";
    del.textContent = "✕";
    del.setAttribute("aria-label", `Delete "${todo.title}"`);
    del.addEventListener("click", () => remove(todo));

    li.append(check, title, del);
    listEl.append(li);
  }
}

async function load() {
  render(await api("/api/todos"));
}

async function add(title) {
  await api("/api/todos", { method: "POST", body: JSON.stringify({ title }) });
  await load();
}

async function toggle(todo, done) {
  await api(`/api/todos/${todo.id}`, {
    method: "PATCH",
    body: JSON.stringify({ done }),
  });
  await load();
}

async function remove(todo) {
  await api(`/api/todos/${todo.id}`, { method: "DELETE" });
  await load();
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = inputEl.value.trim();
  if (!title) return;
  inputEl.value = "";
  await add(title);
  inputEl.focus();
});

clearBtn.addEventListener("click", async () => {
  const todos = await api("/api/todos");
  await Promise.all(
    todos.filter((t) => t.done).map((t) => api(`/api/todos/${t.id}`, { method: "DELETE" })),
  );
  await load();
});

load().catch((err) => {
  console.error(err);
  emptyEl.hidden = false;
  emptyEl.textContent = "Could not reach the API. Is the server running?";
});
