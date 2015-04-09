var Configuration = require("./config").Configuration;

exports["test config instantiate"] = function(assert) {
  var config = new Configuration();
  assert.ok(config, "Configuration instantiated");
};

require("sdk/test").run(exports);

