var Matcher = require("./matcher").Matcher;
var mock = require("./mock-channel.js");

exports["test exact host match"] = function(assert) {
  var matcher = new Matcher([ "www.example.com" ]);
  var channel = mock.createMockChannel("www.example.com", "/");
  assert.strictEqual(matcher.testRequest(channel), true,
      "Exact host match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Exact host match response");
}

exports["test partial host match"] = function(assert) {
  var channel = mock.createMockChannel("www.example.com", "/");
  var matcher = new Matcher([ "www." ]);
  assert.strictEqual(matcher.testRequest(channel), true,
      "Prefix host match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Prefix host match response");
  var matcher = new Matcher([ ".example.com" ]);
  assert.strictEqual(matcher.testRequest(channel), true,
      "Suffix host match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Suffix host match response");
  var matcher = new Matcher([ ".example." ]);
  assert.strictEqual(matcher.testRequest(channel), true,
      "Middle host match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Middle host match response");
  var matcher = new Matcher([ "www.exam*.com" ]);
  assert.strictEqual(matcher.testRequest(channel), true,
      "Glob host match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Glob host match response");
  var matcher = new Matcher([ "www.exa??le.com" ]);
  assert.strictEqual(matcher.testRequest(channel), true,
      "Wildcard host match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Wildcard host match response");
}

exports["test host nonmatch"] = function(assert) {
  var channel = mock.createMockChannel("example.com", "/");
  var matcher = new Matcher([ "www." ]);
  assert.strictEqual(matcher.testRequest(channel), false,
      "Prefix host nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Prefix host nonmatch response");
  var matcher = new Matcher([ "example.co" ]);
  assert.strictEqual(matcher.testRequest(channel), false,
      "Incomplete host nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Incomplete host nonmatch response");
  var matcher = new Matcher([ ".ample.com" ]);
  assert.strictEqual(matcher.testRequest(channel), false,
      "Suffix host nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Suffix host nonmatch response");
  var matcher = new Matcher([ ".exam." ]);
  assert.strictEqual(matcher.testRequest(channel), false,
      "Middle host nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Middle host nonmatch response");
  var matcher = new Matcher([ "*.example.com" ]);
  assert.strictEqual(matcher.testRequest(channel), false,
      "Glob host nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Glob host nonmatch response");
  var matcher = new Matcher([ "exa?mple.com" ]);
  assert.strictEqual(matcher.testRequest(channel), false,
      "Wildcard nonhost match request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Wildcard nonhost match response");
}

require("sdk/test").run(exports);

