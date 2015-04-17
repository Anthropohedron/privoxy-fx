var addonPrefs = require("sdk/simple-prefs").prefs;
var config = require("./config");
var defaultConfig = config.getDefaultConfig();

function postTestCleanup() {
  addonPrefs.configJSON = "null";
  config.setConfig(null);
}

exports["test config load default"] = function(assert) {
  assert.ok(!config.getConfig(), "No config initially loaded");
  assert.ok(!config.loadConfig(), "Default configuration loaded");
  assert.deepEqual(defaultConfig, config.getConfig(),
      "Loaded config matches default config");
  assert.strictEqual(addonPrefs.configJSON,
      JSON.stringify(config.getConfig()),
      "Loaded config matches prefs config");
  postTestCleanup();
};

exports["test config save config"] = function(assert) {
  assert.ok(!config.getConfig(), "No config initially loaded");
  assert.ok(addonPrefs.configJSON === "null", "No config in prefs");
  assert.ok(config.saveConfig(), "Saved default configuration");
  assert.strictEqual(addonPrefs.configJSON, JSON.stringify(defaultConfig),
      "Config stored in prefs");
  assert.ok(!config.getConfig(), "Still no config loaded");
  assert.ok(config.loadConfig(), "Loaded config from prefs");
  assert.deepEqual(defaultConfig, config.getConfig(),
      "Loaded config matches default config");
  postTestCleanup();
};

require("sdk/test").run(exports);

