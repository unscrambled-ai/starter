/**
 * REST connector and sync connector for the Todo App.
 *
 * The REST connector handles HTTP communication with the Todo API.
 * The sync connector wires up the model connectors for bidirectional data sync.
 */

import { z } from "zod";
import { RestConnector, createSyncConnector } from "@unscrambled/sdk";
import { taskManagement } from "../taskManagement";

const TodoResponseSchema = z.object({
  todo: z.object({
    id: z.string(),
    updatedAt: z.string(),
  }),
});

const TodoListResponseSchema = z.object({
  todos: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
      dueDate: z.string().nullable(),
      completedAt: z.string().nullable(),
      updatedAt: z.string(),
    })
  ),
  pagination: z.object({
    hasMore: z.boolean(),
    nextOffset: z.number().optional(),
  }),
});

function mapStatusFromApi(status: string): string {
  switch (status) {
    case "PENDING":
      return "pending";
    case "IN_PROGRESS":
      return "inProgress";
    case "COMPLETED":
      return "completed";
    default:
      return "pending";
  }
}

function mapStatusToApi(status: string): string {
  switch (status) {
    case "pending":
      return "PENDING";
    case "inProgress":
      return "IN_PROGRESS";
    case "completed":
      return "COMPLETED";
    default:
      return "PENDING";
  }
}

export const todoApiConnector = new RestConnector({
  baseUrl: "https://todo-api.unscrambled.dev/api",
  headers: {
    "x-api-key": "{{ apiKey }}",
  },
});

export const todoSyncConnector = createSyncConnector(
  todoApiConnector,
  taskManagement
)
  .withModelConnector("task", (model) =>
    model
      .withList({
        request: (params) => ({
          endpoint: "/todos",
          method: "GET",
          params: {
            limit: 100,
            orderBy: "updatedAt",
            updatedAt_gt: params.lastExternalUpdatedAt ?? undefined,
            offset: params.cursor ?? undefined,
          },
        }),
        responseSchema: TodoListResponseSchema,
        transform: (response) =>
          response.todos.map((todo) => ({
            externalId: todo.id,
            externalUpdatedAt: todo.updatedAt,
            data: {
              title: todo.title,
              description: todo.description,
              status: mapStatusFromApi(todo.status),
              dueDate: todo.dueDate,
              completedAt: todo.completedAt,
            },
          })),
        pagination: (args) => ({
          cursor: args.response.pagination.hasMore
            ? String(args.response.pagination.nextOffset)
            : null,
          page: null,
          offset: null,
          hasMore: args.response.pagination.hasMore,
        }),
      })
      .withCreate({
        request: (data) => ({
          endpoint: "/todos",
          method: "POST",
          json: {
            title: data.title,
            description: data.description,
            status: mapStatusToApi(data.status),
            dueDate: data.dueDate,
            completedAt: data.completedAt,
          },
        }),
        responseSchema: TodoResponseSchema,
        extract: (response) => ({
          externalId: response.todo.id,
          externalUpdatedAt: response.todo.updatedAt,
        }),
      })
      .withUpdate({
        request: (externalId, data) => ({
          endpoint: `/todos/${externalId}`,
          method: "PATCH",
          json: {
            title: data.title,
            description: data.description,
            status: mapStatusToApi(data.status),
            dueDate: data.dueDate,
            completedAt: data.completedAt,
          },
        }),
        responseSchema: TodoResponseSchema,
        extract: (response) => ({
          externalId: response.todo.id,
          externalUpdatedAt: response.todo.updatedAt,
        }),
      })
      .withDelete({
        request: (externalId) => ({
          endpoint: `/todos/${externalId}`,
          method: "DELETE",
        }),
      })
  )
  .build();
