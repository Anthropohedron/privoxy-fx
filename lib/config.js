/*jslint vars: true, white: true, plusplus: true, todo: true */
"use strict";
var addonPrefs = require("sdk/simple-prefs").prefs;

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
  //TODO
};

function Configuration() {
  var config = null;
  try {
    config = JSON.parse(addonPrefs.configJSON);
  } catch (ignore) { }
  if (!config) {
    config = JSON.stringify(defaultConfig);
    addonPrefs.configJSON = config;
    config = JSON.parse(config);
  }
  this.config = config;
}

Configuration.prototype = {
  //TODO
};

exports.Configuration = Configuration;

