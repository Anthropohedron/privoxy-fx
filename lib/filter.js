/*jslint vars: true, white: true, plusplus: true, todo: true */
"use strict";

function subToRE(sub) {
  var newSub = [
    new RegExp(sub.find, sub.flag),
    sub.repl
  ];
  //TODO: check repl to determine whether it requires
  //TODO: a function instead of a simple substitution
  return newSub;
}

function Filter(config) {
  this.subs = config.subs.map(subToRE);
}

Filter.prototype = {

  exec: function execFilter(text) {
    this.subs.forEach(function(sub) {
      text = text.replace(sub[0], sub[1]);
    });
    return text;
  }

};

exports.Filter = Filter;

