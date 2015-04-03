/*jslint vars: true, white: true, plusplus: true, todo: true */
/*globals WeakMap: true */
"use strict";

var requestMap  = new WeakMap();
var responseMap = new WeakMap();

/*jslint regexp: true */
var headerRE = /^([^:]+):\s*(.+)$/;
/*jslint regexp: false */

var tagSplitRE = /:\s*/;
function TagMatcher(pattern) {
  var frags = pattern.split(tagSplitRE);
  this.header = frags[1].toLowerCase();
  this.value = frags[2] && new RegExp(frags[2]);
}
TagMatcher.prototype = {
  testMap: function testMap(map, key) {
    var headers = map[key];
    if (headers && headers.hasOwnProperty(this.header)) {
      return !this.value || this.value.test(headers[this.header]);
    }
    return false;
  },
  testRequest: function testRequest(req) {
    return this.testMap(requestMap, req);
  },
  testResponse: function testResponse(resp) {
    return this.testMap(responseMap, resp);
  }
};

function addTag(map, key, header) {
  var headers, match = headerRE.exec(header);
  if (!match) { return; }
  if (map.has(key)) {
    headers = map.get(key);
  } else {
    headers = [];
    map.set(key, headers);
  }
  headers.push(header);
  headers[match[1]] = match[2];
}

exports.tagMatchForPattern = function tagMatchForPattern(pattern) {
  return new TagMatcher(pattern);
};
exports.addRequestTag = function addRequestTag(channel, header) {
  addTag(requestMap, channel, header);
};
exports.addResponseTag = function addResponseTag(channel, header) {
  addTag(responseMap, channel, header);
};

