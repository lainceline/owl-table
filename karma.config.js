// Karma configuration
// Generated on Mon Nov 10 2014 23:09:50 GMT-0500 (EST)

module.exports = function(config) {
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


		// list of files to exclude
		exclude: [
		],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
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
		reporters: ['progress', 'html', 'coverage'],


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false
	});
};
