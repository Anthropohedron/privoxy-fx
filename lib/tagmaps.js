/*jslint vars: true, white: true, plusplus: true, todo: true */
/*globals WeakMap: true */
"use strict";

var requestMap  = new WeakMap();
var responseMap = new WeakMap();

/*jslint regexp: true */
var headerRE = /^([^:]+):\s*(.+)$/;
/*jslint regexp: false */

/*jslint regexp: true */
var tagSplitRE = /^(?:NO-(REQUEST|RESPONSE)-)?TAG:(.*?)\s*$/;
/*jslint regexp: false */
function TagMatcher(pattern) {
  var frags = tagSplitRE.exec(pattern);
  if (!frags) {
    throw new Error("Invalid tag pattern: '" + pattern + "'");
  }
  this.specific = frags[1]; 
  this.valueRE = new RegExp(frags[2]);
}
TagMatcher.prototype = {
  testMap: function testMap(map, key) {
    var headers = map.get(key);
    if (!headers) { return false; }
    var valueRE = this.valueRE;
    var i, len = headers.length;
    for (i=0; i<len; ++i) {
      if (valueRE.test(headers[i])) { return true; }
    }
    return false;
  },
  testRequest: function testRequest(req) {
    if (this.specific && (this.specific !== "REQUEST")) {
      throw new Error("Matching a NO-RESPONSE-TAG against a request");
    }
    return this.testMap(requestMap, req);
  },
  testResponse: function testResponse(resp) {
    if (this.specific && (this.specific !== "RESPONSE")) {
      throw new Error("Matching a NO-REQUEST-TAG against a response");
    }
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
  headers[match[1].toLowerCase()] = match[2];
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

