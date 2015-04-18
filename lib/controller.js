/*jslint vars: true, white: true, plusplus: true, todo: true */
"use strict";

var util = require("./util");
var config = require("./config");
var Ci = require("chrome").Ci;

var topics = [
  "http-on-modify-request",
  "http-on-examine-response",
  "http-on-examine-cached-response",
  "http-on-examine-merged-response"
];

function Observer() {
  var me = this;
  this.observerService = util.getService("observer-service",
      "nsIObserverService");
  topics.forEach(function(topic) {
    me.observerService.addObserver(me, topic, false);
  });
  this[" is valid "] = true;
}

Observer.prototype = {
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
    delete this[" is valid "];
    return true;
  }

};

var observer;

if (require("sdk/system").staticArgs.supportMockXPCOM) {
  exports.getObserver = function() { return observer; };
}

exports.initialize =
function initialize() {
  if (observer && observer.isValid()) { return false; }
  observer = new Observer();
  return true;
};

exports.isValid =
function isValid() {
  return !!(observer && observer.isValid());
};

exports.invalidate =
function invalidate() {
  var result = observer && observer.invalidate();
  observer = null;
  return !!result;
};

