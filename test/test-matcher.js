var Matcher = require("./matcher").Matcher;

function MockChannel(host, path) {
  this.URI = {
    host: host,
    path: path
  };
}

function createMockChannel(host, path) {
  return new MockChannel(host, path);
}

exports["test create matcher"] = function(assert) {
  var patterns = [
    "TAG:^Content-Type: image/",
    "NO-RESPONSE-TAG:^User-Agent: .*Internet",
    "NO-REQUEST-TAG:^User-Agent: .*Explorer",
    ".example.com/index.html",
    ".example.com"
  ];
  var matcher = new Matcher(patterns);
  assert.ok(matcher, "Created a matcher");
  assert.ok(matcher.patterns, "Has patterns");
  assert.equal(matcher.patterns && matcher.patterns.length,
      patterns.length, "Correct number of patterns");
};

exports["test create match no patterns"] = function(assert) {
  assert.throws(function() {
    var matcher = new Matcher();
    console.error("No patterns: ", matcher);
  }, /no patterns/i, "No arguments to Matcher constructor");
  assert.throws(function() {
    var matcher = new Matcher([]);
    console.error("Empty patterns: ", matcher);
  }, /no patterns/i, "Empty array passed to Matcher constructor");
};

exports["test create match invalid pattern"] = function(assert) {
  assert.throws(function() {
    var matcher = new Matcher([ "foo_" ]);
    console.error("Invalid pattern: ", matcher);
  }, /invalid pattern/i, "Invalid pattern passed to Matcher constructor");
};

exports["test exact host match"] = function(assert) {
  var matcher = new Matcher([ "www.example.com" ]);
  var channel = createMockChannel("www.example.com", "/");
  assert.strictEqual(matcher.testRequest(channel), true,
      "Exact host match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Exact host match response");
}

exports["test partial host match"] = function(assert) {
  var channel = createMockChannel("www.example.com", "/");
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

require("sdk/test").run(exports);
