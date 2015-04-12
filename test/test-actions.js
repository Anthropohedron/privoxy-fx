var actionMgr = require("./actions");

exports["test parse valid"] = function(assert) {
  var actions = actionMgr.parseActions([
      "{",
      "+block{nothing}",
      "-handle-as-image",
      "}"
    ].join(" "));
  assert.ok(actions, "Actions were parsed");
  assert.strictEqual(actions.length, 2, "Correct number of actions");
};

exports["test parse register alias"] = function(assert) {
  var actionsClause = [
    "{",
    "+block{nothing}",
    "foo",
    "-handle-as-image",
    "}"
  ].join(" ");
  assert.throws(function() {
    actionMgr.parseActions(actionsClause);
  }, "Unrecognized alias inside braces");
  actionMgr.registerAlias("foo", [{
    name: "filter",
    param: "foo"
  }]);
  actions = actionMgr.parseActions(actionsClause);
  assert.ok(actions, "Actions with alias were parsed");
  assert.strictEqual(actions.length, 3, "Correct number of actions");
  actionMgr.clearAliases();
};

exports["test parse invalid"] = function(assert) {
  assert.throws(function() {
    actionMgr.parseActions("{ foo +block{nothing} -handle-as-image }");
  }, "Extra garbage inside braces");
  assert.throws(function() {
    actionMgr.parseActions("foo{ +block{nothing} -handle-as-image }");
  }, "Extra garbage outside braces");
  assert.throws(function() {
    actionMgr.parseActions("{ +block{nothing}} -handle-as-image }");
  }, "Extra braces");
  assert.throws(function() {
    actionMgr.parseActions("{} +block{nothing} -handle-as-image {}");
  }, "More extra braces");
};

require("sdk/test").run(exports);

