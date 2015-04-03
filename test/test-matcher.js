var Matcher = require("./matcher").Matcher;

exports["test create path matcher"] = function(assert) {
  var matcher = new Matcher([
    "TAG:^Content-Type: image/",
    "NO-RESPONSE-TAG:^User-Agent: .*Internet",
    "NO-REQUEST-TAG:^User-Agent: .*Explorer",
    ".example.com/index.html",
    ".example.com"
  ]);
  assert.ok(matcher, "Created a matcher");
};

require("sdk/test").run(exports);
