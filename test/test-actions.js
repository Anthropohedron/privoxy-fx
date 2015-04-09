var aParser = require("./actions");

exports["test parse valid"] = function(assert) {
  var actions = aParser.parseActions([
      "{",
      "+block{nothing}",
      "-handle-as-image",
      "}"
    ].join("\n"));
  assert.ok(actions, "Actions were parsed");
  assert.strictEqual(actions.length, 2, "Correct number of actions");
};

exports["test parse invalid"] = function(assert) {
  assert.throws(function() {
    aParser.parseActions("{ foo +block{nothing} -handle-as-image }");
  }, "Extra garbage inside braces");
  assert.throws(function() {
    aParser.parseActions("foo{ +block{nothing} -handle-as-image }");
  }, "Extra garbage outside braces");
  assert.throws(function() {
    aParser.parseActions("{ +block{nothing}} -handle-as-image }");
  }, "Extra braces");
  assert.throws(function() {
    aParser.parseActions("{} +block{nothing} -handle-as-image {}");
  }, "More extra braces");
};

require("sdk/test").run(exports);

