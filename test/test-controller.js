var util = require("./util");
var Controller = require("./controller").Controller;

exports["test controller lifecycle"] = function(assert) {
  var controller = new Controller();
  assert.ok(controller, "Created controller");
  assert.strictEqual(controller.isValid(), true,
      "Controller is valid");
  assert.strictEqual(controller.invalidate(), true,
      "Controller invalidates");
  assert.strictEqual(controller.isValid(), false,
      "Controller is invalid");
  assert.strictEqual(controller.invalidate(), false,
      "Controller invalidates only once");
  assert.strictEqual(controller.isValid(), false,
      "Controller is still invalid");
};

var expectedTopics = [
  "http-on-examine-cached-response",
  "http-on-examine-merged-response",
  "http-on-examine-response",
  "http-on-modify-request"
];

function MockObserverService(assert) {
  this.assert = assert;
  this.topics = [];
  this.controllers = [];
}

MockObserverService.prototype = {
  addObserver: function mockAddObserver(observer, topic, weak) {
    var assert = this.assert;
    this.controllers.push({ o:observer, t:topic });
    assert.ok(expectedTopics.indexOf(topic) >= 0,
      "Controller passed expected topic '" + topic + "' to addObserver");
    assert.ok(!weak,
      "Controller passed weak = false to addObserver(" + topic + ")");
    this.topics.push(topic);
  },
  removeObserver: function mockRemoveObserver(observer, topic) {
    var assert = this.assert;
    assert.strictEqual(observer, this.controller,
      "Controller passes itself to removeObserver(" + topic + ")");
    assert.ok(expectedTopics.indexOf(topic) >= 0,
      "Controller passed expected topic '" + topic + "' to removeObserver");
    this.topics.push(topic);
  },
  checkTopics: function checkTopics(msg) {
    var assert = this.assert;
    this.topics.sort();
    assert.deepEqual(this.topics, expectedTopics, msg);
    this.topics.length = 0;
  },
  checkControllers: function checkControllers(controller) {
    var assert = this.assert;
    this.controller = controller;
    this.controllers.forEach(function(con) {
      assert.strictEqual(con.o, controller,
        "Controller passed itself to addObserver(" + con.t + ")");
    });
  }
};

exports["test controller observes"] = function(assert) {
  var mockObSrv = new MockObserverService(assert);
  util.setMock("nsIObserverService", mockObSrv);
  var controller = new Controller();
  assert.ok(controller, "Created controller");
  mockObSrv.checkTopics("Controller subscribed to all expected topics");
  mockObSrv.checkControllers(controller);
  assert.strictEqual(controller.invalidate(), true,
      "Controller invalidates");
  mockObSrv.checkTopics("Controller unsubscribed from all expected topics");
  assert.strictEqual(controller.isValid(), false,
      "Controller is invalid");
  assert.strictEqual(controller.invalidate(), false,
      "Controller invalidates only once");
  assert.strictEqual(mockObSrv.topics.length, 0,
      "Controller did not attempt to unsubscribe again");
  assert.strictEqual(controller.isValid(), false,
      "Controller is still invalid");
  util.clearMock("nsIObserverService");
};

require("sdk/test").run(exports);

