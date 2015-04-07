/*jslint white: true, todo: true */
"use strict";

// Import Mozilla chrome APIs
var chrome = require("chrome");
var Cc = chrome.Cc;
var Ci = chrome.Ci;

exports.createInstance = function createInstance(contractId, iface) {
  return Cc[contractId].createInstance(Ci[iface]);
};

exports.getService = function getService(contractId, service) {
  return Cc[contractId].getService(Ci[service]);
};

