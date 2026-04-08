import {
  createRestConnector,
  defineApiKeyCustomApp,
} from "@unscrambled/sdk";
import z from "zod";


export const granolaApp = defineApiKeyCustomApp("granola")
  .withTitle("Granola")
  .deploy();

