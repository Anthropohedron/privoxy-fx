/*jslint white: true, todo: true */
"use strict";

var Controller = require("./controller").Controller;
var session;

function addonStartup(options /*, callbacks */) {
  switch (options.loadReason) {
    case "install":
    case "enable":
    case "startup":
    case "upgrade":
    case "downgrade":
      //NOOP
      break;
    default:
      return;
  }
  if (session && session.isValid()) { return; }
  session = new Controller();
}

function addonShutdown(reason) {
  switch (reason) {
    case "uninstall":
    case "disable":
    case "shutdown":
    case "upgrade":
    case "downgrade":
      //NOOP
      break;
    default:
      return;
  }
  session.invalidate();
  session = null;
}

exports.main = addonStartup;
exports.onUnload = addonShutdown;

