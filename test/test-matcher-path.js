var Matcher = require("./matcher").Matcher;
var mock = require("./mock-channel.js");

exports["test exact path match"] = function(assert) {
  var channel = mock.createMockChannel("www.example.com", "/foo/bar");
  var matcher = new Matcher([ "www.example.com/foo/bar$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), true,
      "Exact path match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Exact path match response");
};

exports["test partial path match"] = function(assert) {
  var channel = mock.createMockChannel("www.example.com", "/foo/bar/baz.html");
  var matcher = new Matcher([ "www.example.com/foo/bar" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), true,
      "Prefix path match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Prefix path match response");
  matcher = new Matcher([ "www.example.com/.*/baz.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), true,
      "Suffix path match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Suffix path match response");
  matcher = new Matcher([ "www.example.com/foo/bar/(quux/)?baz.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), true,
      "Optional element path match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Optional element path match response");
  matcher = new Matcher([ "www.example.com/foo(/ba[rz])*.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), true,
      "Complex regex path match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Complex regex path match response");
};

exports["test path nonmatch"] = function(assert) {
  var channel = mock.createMockChannel("example.com", "/foo/bar/baz.html");
  var matcher = new Matcher([ "example.com/foo/Bar/baz.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), false,
      "Case sensitive path nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Case sensitive path nonmatch response");
  var matcher = new Matcher([ "example.com/foo/baz.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), false,
      "Incomplete path nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Incomplete path nonmatch response");
  var matcher = new Matcher([ "example.com/.*/bar.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), false,
      "Suffix path nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Suffix path nonmatch response");
  var matcher = new Matcher([ "example.com/.*/baz/.*$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), false,
      "Middle path nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Middle path nonmatch response");
  var matcher = new Matcher([ "example.com/foo(/ba[py])*.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), false,
      "Chars path nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Chars path nonmatch response");
  var matcher = new Matcher([ "example.com/foo(/bar)*.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), false,
      "Wildcard nonpath match request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Wildcard nonpath match response");
};

exports["test partial host match"] = function(assert) {
  var channel = mock.createMockChannel("www.example.com", "/foo.html");
  var matcher = new Matcher([ "www./foo.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), true,
      "Prefix host/path match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Prefix host/path match response");
  matcher = new Matcher([ ".example.com/foo.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), true,
      "Suffix host/path match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Suffix host/path match response");
  matcher = new Matcher([ ".example./foo.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), true,
      "Middle host/path match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Middle host/path match response");
  var matcher = new Matcher([ "www.exam*.com/foo.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), true,
      "Glob host/path match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Glob host/path match response");
  var matcher = new Matcher([ "www.exa??le.com/foo.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), true,
      "Wildcard host/path match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Wildcard host/path match response");
};

exports["test host nonmatch"] = function(assert) {
  var channel = mock.createMockChannel("example.com", "/foo.html");
  var matcher = new Matcher([ "www./foo.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), false,
      "Prefix host/path nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Prefix host/path nonmatch response");
  var matcher = new Matcher([ "example.co/foo.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), false,
      "Incomplete host/path nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Incomplete host/path nonmatch response");
  var matcher = new Matcher([ ".ample.com/foo.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), false,
      "Suffix host/path nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Suffix host/path nonmatch response");
  var matcher = new Matcher([ ".exam./foo.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), false,
      "Middle host/path nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Middle host/path nonmatch response");
  var matcher = new Matcher([ "*.example.com/foo.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), false,
      "Glob host/path nonmatch request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Glob host/path nonmatch response");
  var matcher = new Matcher([ "exa?mple.com/foo.html$" ]);
  assert.ok(matcher, "Created matcher");
  assert.strictEqual(matcher.testRequest(channel), false,
      "Wildcard nonhost/path match request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Wildcard nonhost/path match response");
};

require("sdk/test").run(exports);

