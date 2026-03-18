/**
 * Task Management collection definition.
 *
 * A collection serves as a canonical representation of data that needs to be synchronized across
 * multiple applications. Models define the data structures, schemas enforce data integrity, and
 * matching rules help merge records from different systems.
 */

import { defineCollection } from "@unscrambled/sdk";

export const taskManagement = defineCollection("taskManagement")
  .withTitle("Task Management")
  .addModel("task", {
    title: "Task",
    matchPattern: "title",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
        },
        description: {
          type: ["string", "null"],
        },
        status: {
          type: "string",
          enum: ["pending", "inProgress", "completed"],
        },
        dueDate: {
          type: ["string", "null"],
        },
        completedAt: {
          type: ["string", "null"],
        },
      },
      required: ["title", "status"],
    },
  })
  .deploy();
