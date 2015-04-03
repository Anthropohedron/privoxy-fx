var tagMaps = require("./tagmaps");
var fakeUserAgent = "User-Agent: Fake Mozilla Agent like wget";

exports["test add request header"] = function(assert) {
  tagMaps.addRequestTag({}, fakeUserAgent);
  assert.pass("Added a request header");
};

exports["test add response header"] = function(assert) {
  tagMaps.addResponseTag({}, fakeUserAgent);
  assert.pass("Added a response header");
};

exports["test create matcher"] = function(assert) {
  var matcher = tagMaps.tagMatchForPattern("TAG:^User-Agent: Fake");
  assert.ok(matcher, "Created a tag matcher");
};

exports["test complete match request tag"] = function(assert) {
  var channel = { foo: "bar" };
  var matcher = tagMaps.tagMatchForPattern("TAG:^"+fakeUserAgent);
  assert.ok(matcher, "Created the tag matcher");
  tagMaps.addRequestTag(channel, fakeUserAgent);
  assert.pass("Added user agent tag");
  assert.strictEqual(matcher.testRequest(channel), true, "Matched tag");
};

require("sdk/test").run(exports);
