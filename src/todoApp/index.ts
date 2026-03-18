/**
 * Todo App integration entry point.
 *
 * Defines the custom app and the sync integration using the Unscrambled SDK builder API.
 */

import { defineApiKeyCustomApp, defineIntegration } from "@unscrambled/sdk";
import { taskManagement } from "../taskManagement";

const todoApp = defineApiKeyCustomApp("todoApp")
  .withTitle("Todo App")
  .deploy();

defineIntegration("todoApp")
  .withTitle("Todo App")
  .withCustomApp(todoApp)
  .withCollection(taskManagement)
  .withSyncSchedules({
    incremental: { every: "1 minute" },
    full: { every: "15 minutes" },
  })
  .deploy();
