/**
 * Set up the Lightyear handlers and import the project entry point.
 *
 * You should generally not need to edit this file.
 */

import { handler } from "@runlightyear/sdk";
import "./src";

exports.handler = handler;
global.handler = handler;
