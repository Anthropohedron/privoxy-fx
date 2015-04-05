/*jslint vars: true, white: true, plusplus: true, todo: true */
"use strict";
var tagMaps = require('./tagmaps');

function AbstractPattern(apply) {
  if (!apply) { return; }
  var prop;
  for (prop in apply) {
    if (apply.hasOwnProperty(prop)) {
      this[prop] = apply[prop];
    }
  }
}
AbstractPattern.prototype = {
  testURI: function defaultTestURI() { return false; },
  testRequest: function defaultTestRequest(req) {
    return this.testURI(req.URI);
  },
  testResponse: function defaultTestResponse(resp) {
    return this.testURI(resp.URI);
  }
};

function TagPattern(pattern) {
  this.matcher = tagMaps.tagMatchForPattern(pattern);
}
TagPattern.prototype = new AbstractPattern({
  testRequest: function testRequest(req) {
    return this.matcher.testRequest(req);
  },
  testResponse: function testResponse(resp) {
    return this.matcher.testResponse(resp);
  }
});

function NegReqTagPattern(pattern) {
  this.matcher = tagMaps.tagMatchForPattern(pattern);
}
NegReqTagPattern.prototype = new AbstractPattern({
  testRequest: function testRequest(req) {
    return !this.matcher.testRequest(req);
  }
});

function NegRespTagPattern(pattern) {
  this.matcher = tagMaps.tagMatchForPattern(pattern);
}
NegRespTagPattern.prototype = new AbstractPattern({
  testResponse: function testResponse(resp) {
    return !this.matcher.testResponse(resp);
  }
});

/*jslint regexp: true */
var hostGlobRE = /\[[\-a-z0-9.]+\]|\.|\?|\*|[^\-a-z0-9.]/g;
/*jslint regexp: false */
var domainRE = /^(\\\.)?/;
function globToRE(str) {
  switch (str) {
    case ".":
      return "\\.";
    case "?":
      return "[-a-z0-9]";
    case "*":
      return "[-a-z0-9]*";
  }
  return (str.length > 1) ? str : "";
}
function matchDomain(str) {
  return str ? "\\.?" : "^";
}
function hostGlobToRE(host) {
  var re = host.replace(hostGlobRE, globToRE);
  re = re.replace(domainRE, matchDomain);
  if (!host.endsWith(".")) { re += "$"; }
  return re;
}

function HostPattern(pattern) {
  this.hostRE = new RegExp(hostGlobToRE(pattern));
}
HostPattern.prototype = new AbstractPattern({
  testURI: function testURI(uri) {
    return this.hostRE.test(uri.host);
  }
});

/*jslint regexp: true */
var pathRE = /^([\-.\[\]a-z0-9]*)(\/.+)$/;
/*jslint regexp: false */
var fakeRE = { test: function() { return true; } };
function PathPattern(pattern) {
  var match = pathRE.exec(pattern);
  if (!match) {
    throw new Error("Invalid path pattern: '" + pattern + "'");
  }
  this.hostRE = match[1] ?
    new RegExp(hostGlobToRE(match[1])) : fakeRE;
  this.pathRE = new RegExp(match[2]);
}
PathPattern.prototype = new AbstractPattern({
  testURI: function testURI(uri) {
    return this.hostRE.test(uri.host) && this.pathRE.test(uri.path);
  }
});

var tagRE = /^TAG:/;
var negReqTagRE = /^NO-REQUEST-TAG:/;
var negRespTagRE = /^NO-RESPONSE-TAG:/;
var hostRE = /^([\-.\[\]a-z0-9]+)\/?$/;
function createPattern(pattern) {
  pattern = pattern.trim();
  if (tagRE.test(pattern)) {
    return new TagPattern(pattern);
  }
  if (negReqTagRE.test(pattern)) {
    return new NegReqTagPattern(pattern);
  }
  if (negRespTagRE.test(pattern)) {
    return new NegRespTagPattern(pattern);
  }
  if (pathRE.test(pattern)) {
    return new PathPattern(pattern);
  }
  if (hostRE.test(pattern)) {
    return new HostPattern(pattern);
  }
  throw new Error("Invalid pattern: '" + pattern + "'");
}

function Matcher(patterns) {
  if (!(patterns && patterns.length)) {
    throw new Error("No patterns provided to Matcher");
  }
  this.patterns = patterns.map(createPattern);
}

Matcher.prototype.testRequest = function testRequest(httpChannel) {
  var m, patterns = this.patterns;
  var i, len = patterns.length;
  for (i=0; i<len; ++i) {
    m = patterns[i];
    if (m.testRequest && m.testRequest(httpChannel)) { return true; }
  }
  return false;
};

Matcher.prototype.testResponse = function testRequest(httpChannel) {
  var m, patterns = this.patterns;
  var i, len = patterns.length;
  for (i=0; i<len; ++i) {
    m = patterns[i];
    if (m.testResponse && m.testResponse(httpChannel)) { return true; }
  }
  return false;
};

exports.Matcher = Matcher;

