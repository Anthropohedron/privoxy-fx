/*jslint white: true, todo: true */
"use strict";

// Import the page-mod API
var pageMod = require("sdk/page-mod");
// Import the self API
var self = require("sdk/self");
// Import Mozilla chrome APIs
var chrome = require("chrome");
var Cc = chrome.Cc;
var Ci = chrome.Ci;

var prerequestObserver = {
  observe: function(subject, topic) {
    if (topic === "http-on-modify-request") {
      var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
      //TODO
      //httpChannel.setRequestHeader("X-Hello", "World", false);
      return httpChannel;
    }
  },

  observerService: (function() {
    var services = Cc["@mozilla.org/observer-service;1"];
    return services.getService(Ci.nsIObserverService);
  }()),

  register: function() {
    if (this[" is registered "]) { return; }
    this.observerService.addObserver(this, "http-on-modify-request", false);
    this[" is registered "] = true;
  },

  unregister: function() {
    if (!this[" is registered "]) { return; }
    this.observerService.removeObserver(this, "http-on-modify-request");
    delete this[" is registered "];
  }
};

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
  prerequestObserver.register();
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
  prerequestObserver.unregister();
}

exports.main = addonStartup;
exports.onUnload = addonShutdown;

