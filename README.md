# jubilant-waddle

A tiny full-stack **Todo** app used to demonstrate a working Cloud Agent
development environment end to end. It is intentionally small: an Express JSON
API with an in-memory store, served alongside a modern vanilla-JS single-page
UI.

## Stack

- **Runtime:** Node.js (>= 20)
- **Server:** [Express](https://expressjs.com/) (`src/server.js`)
- **Frontend:** static HTML/CSS/JS in `public/`
- **Tests:** Node's built-in test runner (`node --test`)

## Getting started

```bash
npm ci        # install dependencies
npm start     # start the app on http://localhost:3000
```

Then open http://localhost:3000 and add, complete, and delete todos.

### Useful scripts

| Command       | Description                                  |
| ------------- | -------------------------------------------- |
| `npm start`   | Start the server on `PORT` (default `3000`). |
| `npm run dev` | Start with file watching for development.    |
| `npm test`    | Run the API integration tests.               |

## API

| Method   | Path              | Description                    |
| -------- | ----------------- | ----------------------------- |
| `GET`    | `/api/health`     | Health check.                 |
| `GET`    | `/api/todos`      | List todos.                   |
| `POST`   | `/api/todos`      | Create a todo (`{ title }`).  |
| `PATCH`  | `/api/todos/:id`  | Update `title` and/or `done`. |
| `DELETE` | `/api/todos/:id`  | Delete a todo.                |

## Cloud Agent environment

`.cursor/environment.json` defines the environment:

- **install:** `npm ci`
- **terminals:** `web` runs `npm start`
- **ports:** `3000` is exposed
