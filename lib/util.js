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

exports.createInstance = function createInstance(contractId, iface) {
  contractFrags[1] = contractId;
  return Cc[contractFrags.join("")].createInstance(Ci[iface]);
};

exports.getService = function getService(contractId, service) {
  contractFrags[1] = contractId;
  return Cc[contractFrags.join("")].getService(Ci[service]);
};

