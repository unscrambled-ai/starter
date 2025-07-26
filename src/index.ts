import {
  defineAction,
  defineCollection,
  defineCustomApp,
  defineIntegration,
} from "@runlightyear/sdk";

defineCollection("hello-world").deploy();

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
