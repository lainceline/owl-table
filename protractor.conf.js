// An example configuration file.

exports.config = {
  directConnect: false,
  allScriptsTimeout: 11000,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },
  seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['tests/e2e/**/*_spec.js'],

  framework: 'jasmine',

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
