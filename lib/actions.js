/*jslint vars: true, white: true, plusplus: true, todo: true */
"use strict";

var supportedActionsMap = {
  "add-header":               "multi",
  "block":                    "param",
  "client-header-filter":     "multi",
  "client-header-tagger":     "multi",
  "content-type-overwrite":   "param",
  "crunch-client-header":     "multi",
  "crunch-if-none-match":     "bool",
  "crunch-incoming-cookies":  "bool",
  "crunch-server-header":     "multi",
  "crunch-outgoing-cookies":  "bool",
  "deanimate-gifs":           "param",
  "fast-redirects":           "param",
  "filter":                   "multi",
  "force-text-mode":          "bool",
  "handle-as-empty-document": "bool",
  "handle-as-image":          "bool",
  "hide-accept-language":     "param",
  "hide-content-disposition": "param",
  "hide-if-modified-since":   "param",
  "hide-referrer":            "param",
  "hide-user-agent":          "param",
  "limit-cookie-lifetime":    "param",
  "overwrite-last-modified":  "param",
  "prevent-compression":      "bool",
  "redirect":                 "param",
  "server-header-filter":     "multi",
  "server-header-tagger":     "multi",
  "session-cookies-only":     "bool",
  "set-image-blocker":        "param"
};
var supportedActions = (function() {
  var action, actions = [];
  for (action in supportedActionsMap) {
    if (supportedActionsMap.hasOwnProperty(action)) {
      actions.push(action);
    }
  }
  return actions;
}());

var aliases = {};
exports.clearAliases = function clearAliases() { aliases = {}; };
function isKnownAlias(alias) {
  return aliases.hasOwnProperty(alias);
};
exports.isKnownAlias = isKnownAlias;

// returns whether we overwrote an existing alias
function registerAlias(alias, configs, noValidation) {
  var exists = aliases.hasOwnProperty(alias);
  if (!noValidation) {
    configs.forEach(function(config) {
      var name = config.name;
      if (name === "negate") {
        name = config.negatedName;
        if (!supportedActionsMap.hasOwnProperty(name)) {
          throw new Error("Unknown (negated) action: " + name);
        }
      } else if (!(supportedActionsMap.hasOwnProperty(name) ||
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
   supportedActions.join("|") +
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

