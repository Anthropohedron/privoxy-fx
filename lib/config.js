/*jslint vars: true, white: true, plusplus: true, todo: true */
"use strict";
var addonPrefs = require("sdk/simple-prefs").prefs;

// set plugin prefs syncing by default
(function() {
  var ps = require("sdk/preferences/service");
  var addonId = require("sdk/self").id;
  var simpleprefs = ps.keys("extensions." + addonId);
  var prefix = "services.sync.prefs.sync.extensions." + addonId + ".";

  simpleprefs.forEach(function(prefname){
    var pref = prefix + prefname;
    if (!ps.has(pref)) { ps.set(pref, true); }
  });
}());

var defaultConfig = {
  actionAliases: {
    "+crunch-all-cookies": [{
        name: "crunch-incoming-cookies"
      }, {
        name: "crunch-outgoing-cookies"
      }],
    "-crunch-all-cookies": [{
        name: "negate",
        negatedName: "crunch-incoming-cookies"
      }, {
        name: "negate",
        negatedName: "crunch-outgoing-cookies"
      }]
  },
  actionGroups: [{
      actions: [{
          name: "block",
          param: "garbage"
        }],
      patterns: [
        "ad.",
        "adserv.",
        "ads."
      ]
    }],
  filters: [{
      name: "cybercloud",
      desc: "Convert 'cyber' to 'computery' and 'cloud' to 'butt'",
      subs: [{
          find: "cyber",
          repl: "computery",
          flag: "gI"
        }, {
          find: "cloud",
          repl: "butt",
          flag: "gI"
        }]
    }]
};

var curConfig = null;

if (require("sdk/system").staticArgs.supportMockXPCOM) {
  exports.getDefaultConfig = function() { return defaultConfig; };
  exports.getConfig = function() { return curConfig; };
  exports.setConfig = function(config) { curConfig = config; };
}

exports.loadConfig =
function loadConfig() {
  var config = null;
  var success = true;
  try {
    config = JSON.parse(addonPrefs.configJSON);
  } catch (ignore) { }
  if (!config) {
    success = false;
    config = JSON.stringify(defaultConfig);
    addonPrefs.configJSON = config;
    config = JSON.parse(config);
  }
  curConfig = config;
  return success;
};

exports.saveConfig =
function saveConfig() {
  addonPrefs.configJSON = JSON.stringify(curConfig || defaultConfig);
  return true;
};

exports.actionGroupsForMatches =
function actionGroupsForMatches(callback) {
  var actionGroups = [];
  //TODO
  return actionGroups;
};

