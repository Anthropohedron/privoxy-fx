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

function validateConfig(config) {
  switch (config.name) {
    case "negate":
      if (!allActionsMap.hasOwnProperty(config.negatedName)) {
        throw new Error("Unknown (negated) action: " +
          config.negatedName);
      }
      break;
    case "alias":
      if (!aliases.hasOwnProperty(config.aliasRef)) {
        throw new Error("Unknown alias: " + config.aliasRef);
      }
      break;
    default:
      if (!allActionsMap.hasOwnProperty(config.name)) {
        throw new Error("Unknown action: " + config.name);
      }
  }
}

// returns whether we overwrote an existing alias
function registerAlias(alias, configs, noValidation) {
  var exists = aliases.hasOwnProperty(alias);
  if (!noValidation) { configs.forEach(validateConfig); }
  // easy way to deep copy the configs array
  aliases[alias] = JSON.parse(JSON.stringify(configs));
  return exists;
}
exports.registerAlias = registerAlias;

function flatten(list, elem) {
  if (elem instanceof Array) {
    list.push.apply(list, elem);
  } else {
    list.push(elem);
  }
  return list;
}

exports.registerAliases =
function registerAliases(aliasesCfg) {
  var newAliases = {};
  var oldDeferred =[];
  var tmp, deferred = [];
  var hadDeferred;
  var deferredNames = {};
  var alias, action, actions, newActions;
  var name, i, len;

  for (name in aliasesCfg) {
    if (aliasesCfg.hasOwnProperty(name)) {
      newActions = aliasesCfg[name];
      len = newActions.length;
      actions = [];
      newAliases[name] = actions;
      for (i=0; i<len; ++i) {
        action = newActions[i];
        switch (action.name) {
          case "negate":
            if (!allActionsMap.hasOwnProperty(action.negatedName)) {
              throw new Error("Unknown (negated) action: " +
                  action.negatedName);
            }
            actions.push({
              name: "negate",
              negatedName: action.negatedName,
              param: action.param
            });
            break;
          case "alias":
            if (newAliases.hasOwnProperty(action.aliasRef) &&
                !deferredNames.hasOwnProperty(action.aliasRef)) {
              // found alias, so add all its actions
              actions.push.apply(actions, newAliases[action.aliasRef]);
            } else {
              // deferred
              deferredNames[name] = (deferredNames[name] || 0) + 1;
              actions.push([]);
              deferred.push({
                deferredName: name,
                aliasRef: action.aliasRef,
                actions: actions[actions.length-1]
              });
            }
            break;
          default:
            actions.push({
              name: action.name,
              param: action.param
            });
        }
      }
    }
  }

  hadDeferred = deferred.length;
  while (oldDeferred.length !== deferred.length) {
    oldDeferred.length = 0;
    tmp = oldDeferred;
    oldDeferred = deferred;
    deferred = tmp;
    len = oldDeferred.length;
    for (i=0; i<len; ++i) {
      alias = oldDeferred[i];
      if (newAliases.hasOwnProperty(alias.aliasRef) &&
          !deferredNames.hasOwnProperty(alias.aliasRef)) {
        // found alias, so add all its actions
        actions = alias.actions;
        actions.push.apply(actions, newAliases[alias.aliasRef]);
        if ((--deferredNames[alias.deferredName]) <= 0) {
          delete deferredNames[alias.deferredName];
        }
      } else {
        // still deferred
        deferred.push(alias);
      }
    }
  }
  if (deferred.length) {
    throw new Error("Circular references detected in aliases: " +
        deferred.map(function(defRef) {
          return defRef.deferredName;
        }).join(", "));
  }

  if (hadDeferred) {
    for (name in newAliases) {
      if (newAliases.hasOwnProperty(name)) {
        newAliases[name] = newAliases[name].reduce(flatten, []);
      }
    }
  }
  aliases = newAliases;
};

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

exports.parseActions =
function parseActions(actionsClause) {
  var actions = [];
  var remainder = actionsClause.replace(actionRE,
      toActionConfig.bind(actions));
  if (!emptyActionsRE.test(remainder)) {
    throw new Error("Malformed actions clause:\n\n" + actionsClause);
  }
  return actions;
};

function configToAction(config) {
  var name = config && config.name;
  if (!allActionsMap.hasOwnProperty(name)) {
    throw new Error("Unknown action: '" + name + "'");
  }
  return new allActionsMap[name](config.param);
}

exports.createActions =
function createActions(configs) {
  return configs.map(configToAction);
};

