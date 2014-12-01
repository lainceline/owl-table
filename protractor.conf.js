// An example configuration file.

require('coffee-script');

exports.config = {
  directConnect: true,
  allScriptsTimeout: 11000,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['tests/e2e/**/*_spec.coffee'],

  framework: 'jasmine',

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
