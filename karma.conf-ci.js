var fs = require('fs');

module.exports = function(config) {

	// Use ENV vars on Travis and sauce.json locally to get credentials
	if (!process.env.SAUCE_USERNAME) {
		if (!fs.existsSync('sauce.json')) {
			console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
			process.exit(1);
		} else {
			process.env.SAUCE_USERNAME = require('./sauce').username;
			process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
		}
	}

	// Browsers to run on Sauce Labs
	var customLaunchers = {
		'SL_Chrome': {
			base: 'SauceLabs',
			browserName: 'chrome'
		},
		'SL_Firefox': {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			version: '9'
		}
	};

	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '.',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],


		// list of files / patterns to load in the browser
		files: [
			'node_modules/jasmine-reporters/src/jasmine.terminal_reporter.js',
			'dist/vendor.min.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'lib/*.js',
			'react_components/**/*.js',
			'views/**/*.jade',
			'src/**/*.js',
			'tests/unit/**/*.coffee',
			'tests/unit/react/**/*.cjsx'
		],

		preprocessors: {
			'**/*.coffee': ['coffee'],
			'**/*.jade': ['ng-jade2js'],
			'react_components/**/*.js': ['react-jsx', 'coverage'],
			'src/**/*.js': ['coverage'],
			'tests/unit/react/**/*.cjsx': ['cjsx']
		},

		ngJade2JsPreprocessor: {
			moduleName: 'owlTablePartials',
			stripPrefix: 'views/',
			prependPrefix: 'partials/'
		},


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'html', 'coverage', 'saucelabs'],


		// web server port
		port: 9876,

		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		sauceLabs: {
			testName: 'owl-table'
		},
		captureTimeout: 120000,
		customLaunchers: customLaunchers,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: Object.keys(customLaunchers),
		singleRun: true
	});

	config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
};
