var Matcher = require("./matcher").Matcher;

exports["test create path matcher"] = function(assert) {
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

require("sdk/test").run(exports);
