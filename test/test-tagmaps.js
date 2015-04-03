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

exports["test create complete matcher"] = function(assert) {
  var matcher = tagMaps.tagMatchForPattern("TAG:^User-Agent: Fake");
  assert.ok(matcher, "Created a tag matcher");
};

exports["test create partial matcher"] = function(assert) {
  var matcher = tagMaps.tagMatchForPattern("TAG:Agent: Fake");
  assert.ok(matcher, "Created a tag matcher");
};

exports["test create matcher invalid patter"] = function(assert) {
  assert.throws(function() {
    tagMaps.tagMatchForPattern("^User-Agent: Fake");
  }, /invalid/i, "Tag pattern validation");
};

exports["test create matcher invalid tag pattern"] = function(assert) {
  assert.throws(function() {
    tagMaps.tagMatchForPattern("NO-ACTUAL-TAG:^User-Agent: Fake");
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

exports["test everything complete tag match"] = function(assert) {
  var reqChannel = {};
  var respChannel = {};
  var matcher = tagMaps.tagMatchForPattern("TAG:^"+fakeUserAgent+"$");
  assert.ok(matcher, "Created the tag matcher");
  tagMaps.addRequestTag(reqChannel, fakeUserAgent);
  tagMaps.addResponseTag(respChannel, fakeUserAgent);
  assert.pass("Added user agent tag");
  assert.strictEqual(matcher.testRequest(reqChannel), true,
      "Matched req tag");
  assert.strictEqual(matcher.testRequest(respChannel), false,
      "Unmatched req tag");
  assert.strictEqual(matcher.testResponse(respChannel), true,
      "Matched resp tag");
  assert.strictEqual(matcher.testResponse(reqChannel), false,
      "Unmatched resp tag");
};

exports["test everything partial tag match"] = function(assert) {
  var reqChannel = {};
  var respChannel = {};
  var matcher = tagMaps.tagMatchForPattern("TAG:Agent: Fake");
  assert.ok(matcher, "Created the tag matcher");
  tagMaps.addRequestTag(reqChannel, fakeUserAgent);
  tagMaps.addResponseTag(respChannel, fakeUserAgent);
  assert.pass("Added user agent tag");
  assert.strictEqual(matcher.testRequest(reqChannel), true,
      "Matched req tag");
  assert.strictEqual(matcher.testRequest(respChannel), false,
      "Unmatched req tag");
  assert.strictEqual(matcher.testResponse(respChannel), true,
      "Matched resp tag");
  assert.strictEqual(matcher.testResponse(reqChannel), false,
      "Unmatched resp tag");
};

require("sdk/test").run(exports);

