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

## Local development on macOS

Setting up on a fresh machine (for example after an OS reinstall)? The
`scripts/dev-setup.sh` helper selects a matching Node version (via
[nvm](https://github.com/nvm-sh/nvm) when installed), installs dependencies
from the lockfile, and is safe to run repeatedly.

```bash
# 1. Command Line Tools (provides git) — skip if already installed
xcode-select --install

# 2. Node.js 22 — via nvm (recommended) or Homebrew (`brew install node@22`)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
#   restart the terminal, then:
nvm install 22 && nvm use 22

# 3. Clone and set up
git clone https://github.com/Ganzidan/jubilant-waddle.git
cd jubilant-waddle
./scripts/dev-setup.sh          # install deps and print next steps
./scripts/dev-setup.sh --start  # ...or install deps and start the app
```

If the repository is private, authenticate first with `gh auth login` or clone
over SSH (`git clone git@github.com:Ganzidan/jubilant-waddle.git`).

### Useful scripts

| Command       | Description                                  |
| ------------- | -------------------------------------------- |
| `npm start`   | Start the server on `PORT` (default `3000`). |
| `npm run dev` | Start with file watching for development.    |
| `npm test`    | Run the API integration tests.               |
| `./scripts/dev-setup.sh` | Restore local setup (Node + deps); `--start` also runs the app. |

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
