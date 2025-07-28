import {
  defineAction,
  defineCollection,
  defineCustomApp,
  defineIntegration,
  defineModel,
  defineOAuthConnector,
} from "@runlightyear/sdk";

defineCollection("task-management")
  .withTitle("Task Management")
  .withModel(
    defineModel("task")
      .withTitle("Task")
      .withSchema({
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          completed: { type: "boolean" },
        },
        required: ["id", "title", "description", "completed"],
        additionalProperties: false,
      })
      .deploy()
  )
  .deploy();

const todoCustomApp = defineCustomApp("todo-app", "APIKEY")
  .withTitle("Todo App")
  .deploy();

const helloWorldAction = defineAction("hello-world")
  .withTitle("Hello World")
  .withRun(async () => {
    console.log("Hello World");
  })
  .deploy();

defineIntegration("todo-app")
  .withTitle("Todo App")
  .withCustomApp(todoCustomApp)
  .withActions([
    helloWorldAction,
    defineAction("hello-world-2")
      .withTitle("Hello World 2")
      .withRun(async () => {
        console.log("Hello World 2");
      })
      .deploy(),
  ])
  .deploy();

const hubspotOAuth = defineOAuthConnector("hubspot")
  .withAuthUrl("https://app.hubspot.com/oauth/authorize")
  .withTokenUrl("https://api.hubapi.com/oauth/v1/token")
  .withScope([
    "crm.objects.contacts.read",
    "crm.objects.contacts.write",
    "crm.objects.companies.write",
    "crm.objects.companies.read",
    "crm.objects.deals.read",
    "crm.objects.deals.write",
    "crm.objects.users.read",
    "crm.objects.owners.read",
  ])
  .build();

defineCustomApp("hubspot", "OAUTH2")
  .withTitle("Hubspot")
  .withOAuthConnector(hubspotOAuth)
  .deploy();

defineIntegration("hubspot").withTitle("Hubspot").withApp("hubspot").deploy();
