/**
 * Set up the Unscrambled handlers and import the project entry point.
 *
 * You should generally not need to edit this file.
 */

const { handler, getDeployList } = require("@unscrambled/sdk");
require("./src");

exports.handler = handler;
exports.getDeployList = getDeployList;

global.handler = handler;
global.getDeployList = getDeployList;
