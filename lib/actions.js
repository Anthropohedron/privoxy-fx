/*jslint vars: true, white: true, plusplus: true, todo: true */
"use strict";

var allActionsMap = require("./actions-impl.js").actionsMap;

var allActions = (function() {
  var action, actions = [];
  for (action in allActionsMap) {
    if (allActionsMap.hasOwnProperty(action)) {
      actions.push(action);
    }
  }
  return actions;
}());

var aliases = {};
exports.clearAliases = function clearAliases() { aliases = {}; };
function isKnownAlias(alias) {
  return aliases.hasOwnProperty(alias);
}
exports.isKnownAlias = isKnownAlias;

// returns whether we overwrote an existing alias
function registerAlias(alias, configs, noValidation) {
  var exists = aliases.hasOwnProperty(alias);
  if (!noValidation) {
    configs.forEach(function(config) {
      var name = config.name;
      if (name === "negate") {
        name = config.negatedName;
        if (!allActionsMap.hasOwnProperty(name)) {
          throw new Error("Unknown (negated) action: " + name);
        }
      } else if (!(allActionsMap.hasOwnProperty(name) ||
          aliases.hasOwnProperty(name))) {
        throw new Error("Unknown action/alias: " + name);
      }
    });
  }
  // easy way to deep copy the configs array
  aliases[alias] = JSON.parse(JSON.stringify(configs));
  return exists;
}
exports.registerAlias = registerAlias;

var actionRE = new RegExp("(?:^|\\s)(?:([\\-+])(" +
   allActions.join("|") +
   ")(?:{([^}]+)})?|([\\-+]?[a-z\\-]+))(?=\\s|$)", "gi");
var emptyActionsRE = /^\s*\{\s*\}\s*$/;

function toActionConfig(line, negation, name, param, alias) {
  var cfg;
  if (negation === "-") {
    cfg = {
      actionLine: line.trim(),
      negatedName: name,
      param: param,
      name: 'negate'
    };
  } else if (alias) {
    if (isKnownAlias(alias)) {
      cfg = {
        actionLine: line.trim(),
        configs: aliases[alias],
        name: alias
      };
    } else {
      // don't remove because we didn't parse it
      return line;
    }
  } else {
    // no name validation because it came from the RegExp match
    cfg = {
      actionLine: line.trim(),
      param: param,
      name: name
    };
  }
  this.push(cfg);
  return "";
}

function parseActions(actionsClause) {
  var actions = [];
  var remainder = actionsClause.replace(actionRE,
      toActionConfig.bind(actions));
  if (!emptyActionsRE.test(remainder)) {
    throw new Error("Malformed actions clause:\n\n" + actionsClause);
  }
  return actions;
}

exports.parseActions = parseActions;

