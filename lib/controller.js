/*jslint white: true, todo: true */
"use strict";

var util = require("./util");
var Ci = require("chrome").Ci;

var topics = [
  "http-on-modify-request",
  "http-on-examine-response",
  "http-on-examine-cached-response",
  "http-on-examine-merged-response"
];

function Controller() {
  var me = this;
  this.observerService = util.getService("@mozilla.org/observer-service;1",
      "nsIObserverService");
  topics.forEach(function(topic) {
    me.observerService.addObserver(me, topic, false);
  });
  this[" is valid "] = true;
}

Controller.prototype = {
  observe: function(subject, topic) {
    var httpChannel;
    switch (topic) {
      case "http-on-modify-request":
        httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
        //TODO
        //httpChannel.setRequestHeader("X-Hello", "World", false);
        break;
      case "http-on-examine-response":
      case "http-on-examine-cached-response":
      case "http-on-examine-merged-response":
        httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
        //TODO
        break;
    }
    return httpChannel;
  },

  isValid: function isValid() {
    return !!this[" is valid "];
  },

  invalidate: function() {
    if (!this[" is valid "]) { return; }
    this.observerService.removeObserver(this, "http-on-modify-request");
    delete this[" is valid "];
  }

};

exports.Controller = Controller;

