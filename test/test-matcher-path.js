var Matcher = require("./matcher").Matcher;
var mock = require("./mock-channel.js");

exports["test exact path match"] = function(assert) {
  var matcher = new Matcher([ "www.example.com/foo/bar$" ]);
  var channel = mock.createMockChannel("www.example.com", "/foo/bar");
  assert.strictEqual(matcher.testRequest(channel), true,
      "Exact path match request");
  assert.strictEqual(matcher.testResponse(channel), true,
      "Exact path match response");
}

require("sdk/test").run(exports);

