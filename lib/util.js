/*jslint white: true, todo: true */
"use strict";

var staticArgs = require("sdk/system").staticArgs;
// Import Mozilla chrome APIs
var chrome = require("chrome");
var Cc = chrome.Cc;
var Ci = chrome.Ci;
var contractFrags = [
  "@mozilla.org/",
  null,
  ";1"
];

function createInstance(contractId, iface) {
  contractFrags[1] = contractId;
  return Cc[contractFrags.join("")].createInstance(Ci[iface]);
}
exports.createInstance = createInstance;

function getService(contractId, service) {
  contractFrags[1] = contractId;
  return Cc[contractFrags.join("")].getService(Ci[service]);
}
exports.getService = getService;

if (staticArgs.supportMockXPCOM) {
  (function() {
    var mocks = {};

    exports.createInstance = function createMockInstance(contractId, iface) {
      if (mocks.hasOwnProperty(iface)) { return mocks[iface]; }
      return createInstance(contractId, iface);
    };

    exports.getService = function getMockService(contractId, service) {
      if (mocks.hasOwnProperty(service)) { return mocks[service]; }
      return createInstance(contractId, service);
    };

    exports.setMock = function setMock(key, obj) {
      mocks[key] = obj;
    };

    exports.clearMock = function clearMock(key) {
      delete mocks[key];
    };

  }());
}

