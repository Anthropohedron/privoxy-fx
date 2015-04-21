/*jslint vars: true, white: true, plusplus: true, todo: true */
/*global WeakMap */
"use strict";
var addonPrefs = require("sdk/simple-prefs").prefs;
var actions = require("./actions");
var Matcher = require("./matcher").Matcher;
var Filter = require("./filter").Filter;

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
        }, {
          name: "alias",
          aliasRef: "+crunch-all-cookies"
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
          flag: "gi"
        }, {
          find: "cloud",
          repl: "butt",
          flag: "gi"
        }]
    }]
};

var curConfig = null;
var cookedConfig = null;
var rawToCooked = new WeakMap();

if (require("sdk/system").staticArgs.supportMockXPCOM) {
  exports.getDefaultConfig = function() { return defaultConfig; };
  exports.getConfig = function() { return curConfig; };
  exports.setConfig = function(config) { curConfig = config; };
}

// This does a lot of validation, but exits on the first failure; this
// deals with the internal and nominally opaque config format, though, so
// not giving useful feedback to the user (and silently resetting to the
// default) is probably okay.
function cookConfig(config) {
  var cooked = {};

  // register aliases
  actions.registerAliases(config.actionAliases); //throws

  // instantiate filters
  cooked.filters = config.filters.reduce(function(filters, filter) {
    var cookedFilter = new Filter(filter);
    rawToCooked[filter]  = cookedFilter;
    filters[filter.name] = cookedFilter;
    return filters;
  }, {});

  // build action groups
  cooked.actionGroups = config.actionGroups.map(function(group) {
    var newGroup = {
      matcher: new Matcher(group.patterns)
    };
    //TODO: instantiate matchers
    //TODO: resolve aliases
    //TODO: validate filter references
    return newGroup;
  });

  return cooked;
}

exports.loadConfig =
function loadConfig() {
  var config = null;
  var success = true;
  try {
    config = JSON.parse(addonPrefs.configJSON);
    cookedConfig = cookConfig(config);
  } catch (ignore) { }
  if (config && !cookedConfig) {
    addonPrefs.invalidConfigJSON = JSON.stringify(config);
    config = null;
  }
  if (!config) {
    success = false;
    config = JSON.stringify(defaultConfig);
    addonPrefs.configJSON = config;
    config = JSON.parse(config);
    cookedConfig = cookConfig(config);
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
  var foundActions = [];
  var groups = cookedConfig && cookedConfig.actionGroups;
  groups.forEach(function(group) {
    if (callback(group.matcher)) {
      foundActions.push.apply(foundActions, group.actions);
    }
  });
  return foundActions;
};

