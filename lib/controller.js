/*jslint vars: true, white: true, plusplus: true, todo: true */
"use strict";

var util = require("./util");
var Configuration = require("./config").Configuration;
var Ci = require("chrome").Ci;

var topics = [
  "http-on-modify-request",
  "http-on-examine-response",
  "http-on-examine-cached-response",
  "http-on-examine-merged-response"
];

function Controller() {
  var me = this;
  this.observerService = util.getService("observer-service",
      "nsIObserverService");
  topics.forEach(function(topic) {
    me.observerService.addObserver(me, topic, false);
  });
  this.config = new Configuration();
  this[" is valid "] = true;
}

Controller.prototype = {
  observe: function(subject, topic) {
    var httpChannel;
    switch (topic) {
      case "http-on-modify-request":
        httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
        //TODO: pre-request matching
        //TODO: pre-request actions
        break;
      case "http-on-examine-response":
      case "http-on-examine-cached-response":
      case "http-on-examine-merged-response":
        httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
        //TODO: post-response matching
        //TODO: post-response actions
        break;
    }
    return httpChannel;
  },

  isValid: function isValid() {
    return !!this[" is valid "];
  },

  invalidate: function() {
    if (!this[" is valid "]) { return false; }
    var me = this;
    topics.forEach(function(topic) {
      me.observerService.removeObserver(me, topic);
    });
    delete this.config;
    delete this[" is valid "];
    return true;
  }

};

exports.Controller = Controller;

