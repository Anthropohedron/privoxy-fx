var Matcher = require("./matcher").Matcher;

exports["test create matcher types"] = function(assert) {
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

require("sdk/test").run(exports);

