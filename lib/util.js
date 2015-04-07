/*jslint white: true, todo: true */
"use strict";

// Import Mozilla chrome APIs
var chrome = require("chrome");
var Cc = chrome.Cc;
var Ci = chrome.Ci;
var contractFrags = [
  "@mozilla.org/",
  null,
  ";1"
];
var mocks = {};

exports.createInstance = function createInstance(contractId, iface) {
  if (mocks.hasOwnProperty(iface)) { return mocks[iface]; }
  contractFrags[1] = contractId;
  return Cc[contractFrags.join("")].createInstance(Ci[iface]);
};

exports.getService = function getService(contractId, service) {
  if (mocks.hasOwnProperty(service)) { return mocks[service]; }
  contractFrags[1] = contractId;
  return Cc[contractFrags.join("")].getService(Ci[service]);
};

exports.setMock = function setMock(key, obj) {
  mocks[key] = obj;
};

exports.clearMock = function clearMock(key) {
  delete mocks[key];
};

