/*jslint vars: true, white: true, plusplus: true, todo: true */
"use strict";

var actionRE = /(?:^|\s)([\-+])([\-a-z]+)(?:{([^}]+)})?(?=\s|$)/g;
var emptyActionsRE = /^\s*\{\s*\}\s*$/;

function parseActions(actionsClause) {
  var actions = [];
  var remainder = actionsClause.replace(actionRE, function() {
    actions.push(Array.prototype.slice.call(arguments, 1));
    return "";
  });
  if (!emptyActionsRE.test(remainder)) {
    throw new Error("Malformed actions clause:\n\n" + actionsClause);
  }
  return actions;
}

exports.parseActions = parseActions;

