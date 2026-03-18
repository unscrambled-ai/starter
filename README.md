# Unscrambled Starter

A starter template for building sync integrations with [Unscrambled](https://unscrambled.dev). This project demonstrates how to set up a bidirectional data sync between an external API and a canonical data collection.

## What's Inside

This starter includes a working **Todo App** integration that syncs tasks between a Todo API and a Task Management collection. It covers all the core concepts you need to build your own integrations:

- **Collections** &mdash; Define canonical data models with schemas and matching rules
- **Sync Connectors** &mdash; Connect to external APIs with authentication, data mapping, and pagination
- **Integrations** &mdash; Wire everything together with configurable sync schedules

## Project Structure

```
├── index.js                       # Entry point (handler setup)
├── src/
│   ├── index.ts                   # Imports all collections and connectors
│   ├── taskManagement/
│   │   └── index.ts               # Task Management collection (builder API)
│   └── todoApp/
│       ├── index.ts               # Custom app + integration definition
│       └── TodoApp.ts             # REST connector + sync connector (CRUD)
├── package.json
├── webpack.config.js
└── tsconfig.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- An Unscrambled API key

### Installation

```bash
npm install
```

### Development

Start the local development server with hot reload:

```bash
npm run dev
```

### Build

Create a production build:

```bash
npm run build
```

### Deploy

Deploy to production:

```bash
npm run deploy
```

## Key Concepts

### Collections

A collection is a canonical representation of data that stays in sync across multiple applications. Use the builder API to define models, schemas, and matching rules:

```typescript
import { defineCollection } from "@unscrambled/sdk";

const taskManagement = defineCollection("taskManagement")
  .withTitle("Task Management")
  .addModel("task", {
    title: "Task",
    matchPattern: "title",
    schema: { /* JSON Schema */ },
  })
  .deploy();
```

### Custom Apps

Define a custom app to represent the external service your integration connects to:

```typescript
import { defineApiKeyCustomApp } from "@unscrambled/sdk";

const todoApp = defineApiKeyCustomApp("todoApp")
  .withTitle("Todo App")
  .deploy();
```

### Sync Connectors

A sync connector pairs a REST connector with a collection and defines model connectors for each data model. Model connectors handle `list`, `create`, `update`, and `delete` operations:

```typescript
import { RestConnector, createSyncConnector } from "@unscrambled/sdk";

const api = new RestConnector({
  baseUrl: "https://api.example.com",
  headers: { "x-api-key": "{{ apiKey }}" },
});

const sync = createSyncConnector(api, collection)
  .withModelConnector("task", (model) =>
    model
      .withList({ /* ... */ })
      .withCreate({ /* ... */ })
      .withUpdate({ /* ... */ })
      .withDelete({ /* ... */ })
  )
  .build();
```

### Integrations

Wire an app, collection, and sync schedules together into a deployable integration:

```typescript
import { defineIntegration } from "@unscrambled/sdk";

defineIntegration("todoApp")
  .withTitle("Todo App")
  .withCustomApp(todoApp)
  .withCollection(taskManagement)
  .withSyncSchedules({
    incremental: { every: "1 minute" },
    full: { every: "15 minutes" },
  })
  .deploy();
```

## CI/CD

A sample GitHub Actions workflow is included at `.github/workflows/pipeline.yml.sample`. To use it:

1. Rename it to `pipeline.yml`
2. Add your `UNSCRAMBLED_API_KEY` as a repository secret
3. Push to `main` to trigger a deploy

## License

[MIT](LICENSE)
