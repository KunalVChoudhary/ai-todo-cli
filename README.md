# AI Todo App 📝🤖

An AI-powered Todo application that lets users manage tasks using natural language commands.

Instead of clicking buttons or manually filling forms, users can simply type instructions like:

- "Add buy groceries"
- "Delete drink coffee"
- "Update gym to evening gym"
- "Show all my todos"

The application uses an LLM to understand user intent and execute the appropriate actions.

## Features

- ✅ Create todos using natural language
- 🔍 Search existing todos
- ✏️ Update todo items
- 🗑️ Delete todos
- 📋 View all todos
- 🤖 AI agent workflow for understanding user commands

## Tech Stack

- Node.js
- JavaScript
- Drizzle ORM
- Database (SQLite/PostgreSQL)
- Groq API

## How it works

1. User enters a natural language command.
2. The AI agent analyzes the request.
3. The appropriate tool/function is selected.
4. The database is updated and a response is returned.

## Installation

```bash
git clone <repository-url>

cd ai-todo-app

npm install

npm run dev
```

## Example Commands

```text
Add buy groceries
Delete drink coffee
Update gym to evening gym
Show all todos
```

## License

MIT
