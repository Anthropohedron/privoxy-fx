var Matcher = require("./matcher").Matcher;
var tagMaps = require("./tagmaps");
var mock = require("./mock-channel.js");
var fakeUserAgent = "User-Agent: Fake Mozilla Agent like wget";

exports["test exact tag match"] = function(assert) {
  var matcher = new Matcher([ "TAG:^"+fakeUserAgent+"$" ]);
  assert.ok(matcher, "Created matcher");
  var channel = mock.createMockChannel("www.example.com", "/");
  tagMaps.addRequestTag(channel, fakeUserAgent);
  assert.strictEqual(matcher.testRequest(channel), true,
      "Exact tag match request");
  assert.strictEqual(matcher.testResponse(channel), false,
      "Exact path nonmatch response");
}

require("sdk/test").run(exports);

