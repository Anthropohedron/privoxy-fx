/*jslint vars: true, white: true, plusplus: true, todo: true */
"use strict";
var tagMaps = require('./tagmaps');
var chrome = require("chrome");
var Cc = chrome.Cc;
var Ci = chrome.Ci;

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
  testRequest:  function defaultTestRequest() { return false; },
  testResponse: function defaultTestResponse() { return false; }
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

var cStringConvert = (function(contractId, intf) {
  return Cc[contractId].createInstance(Ci[intf]);
}("@mozilla.org/supports-cstring;1", "nsISupportsCString"));
function utf8ToString(utf8) {
  cStringConvert.data = utf8;
  return cStringConvert.toString();
}

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
    var host = utf8ToString(uri.host);
    return this.hostRE.test(host);
  },
  testRequest: function testRequest(req) {
    return this.testURI(req.URI);
  },
  testResponse: function testResponse(resp) {
    return this.testURI(resp.URI);
  }
});

/*jslint regexp: true */
var pathRE = /^([\-.\[\]a-z0-9]*)(\/.+)$/;
/*jslint regexp: false */
var fakeRE = { test: function() { return true; } };
function PathPattern(pattern) {
  var match = pathRE.exec(pattern);
  if (!match) {
    throw new Error("Invalid pattern: '" + pattern + "'");
  }
  this.hostRE = match[1] ?
    new RegExp(hostGlobToRE(match[1])) : fakeRE;
  this.pathRE = new RegExp(match[2]);
}
PathPattern.prototype = new AbstractPattern({
  testURI: function testURI(uri) {
    var host = utf8ToString(uri.host);
    var path = utf8ToString(uri.path);
    return this.hostRE.test(host) && this.pathRE.test(path);
  },
  testRequest: function testRequest(req) {
    return this.testURI(req.URI);
  },
  testResponse: function testResponse(resp) {
    return this.testURI(resp.URI);
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

