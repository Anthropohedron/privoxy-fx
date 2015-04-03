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

exports["test create invalid matcher"] = function(assert) {
  assert.throws(function() {
    tagMaps.tagMatchForPattern("^User-Agent: Fake");
  }, /invalid/i, "Tag pattern validation");
};

exports["test complete match request tag"] = function(assert) {
  var channel = {};
  var matcher = tagMaps.tagMatchForPattern("TAG:^"+fakeUserAgent+"$");
  assert.ok(matcher, "Created the tag matcher");
  tagMaps.addRequestTag(channel, fakeUserAgent);
  assert.pass("Added user agent tag");
  assert.strictEqual(matcher.testRequest(channel), true, "Matched tag");
};

exports["test complete match response tag"] = function(assert) {
  var channel = {};
  var matcher = tagMaps.tagMatchForPattern("TAG:^"+fakeUserAgent+"$");
  assert.ok(matcher, "Created the tag matcher");
  tagMaps.addResponseTag(channel, fakeUserAgent);
  assert.pass("Added user agent tag");
  assert.strictEqual(matcher.testResponse(channel), true, "Matched tag");
};

exports["test complete match no-request-tag request"] = function(assert) {
  var channel = {};
  var matcher = tagMaps.tagMatchForPattern("NO-REQUEST-TAG:^"+fakeUserAgent+"$");
  assert.ok(matcher, "Created the tag matcher");
  tagMaps.addRequestTag(channel, fakeUserAgent);
  assert.pass("Added user agent tag");
  assert.strictEqual(matcher.testRequest(channel), true, "Matched tag");
};

exports["test complete match no-response-tag response"] = function(assert) {
  var channel = {};
  var matcher = tagMaps.tagMatchForPattern("NO-RESPONSE-TAG:^"+fakeUserAgent+"$");
  assert.ok(matcher, "Created the tag matcher");
  tagMaps.addResponseTag(channel, fakeUserAgent);
  assert.pass("Added user agent tag");
  assert.strictEqual(matcher.testResponse(channel), true, "Matched tag");
};

exports["test complete match no-response-tag request"] = function(assert) {
  var channel = {};
  var matcher = tagMaps.tagMatchForPattern("NO-RESPONSE-TAG:^"+fakeUserAgent+"$");
  assert.ok(matcher, "Created the tag matcher");
  tagMaps.addRequestTag(channel, fakeUserAgent);
  assert.pass("Added user agent tag");
  assert.throws(function() {
    matcher.testRequest(channel);
  }, /NO-RESPONSE-TAG .* request/, "Matching a response against a request");
};

exports["test complete match no-request-tag response"] = function(assert) {
  var channel = {};
  var matcher = tagMaps.tagMatchForPattern("NO-REQUEST-TAG:^"+fakeUserAgent+"$");
  assert.ok(matcher, "Created the tag matcher");
  tagMaps.addResponseTag(channel, fakeUserAgent);
  assert.pass("Added user agent tag");
  assert.throws(function() {
    matcher.testResponse(channel);
  }, /NO-REQUEST-TAG .* response/, "Matching a request against a response");
};

require("sdk/test").run(exports);

