'use strict';

var gulp 		= require('gulp-help')(require('gulp'));

var coffee 		= require('gulp-coffee');
var sass 		= require('gulp-sass');
var jade		= require('gulp-jade');
var react 		= require('gulp-react');
var ngHtml2Js 	= require('gulp-ng-html2js');

var autoprefix  = require('gulp-autoprefixer');
var minifyCSS 	= require('gulp-minify-css');
var minifyHtml 	= require('gulp-minify-html');
var uglify 		= require('gulp-uglify');

var karma 		= require('karma').server;

var rename 		= require('gulp-rename');
var runSequence	= require('run-sequence');
var concat 		= require('gulp-concat');
var clean		= require('gulp-clean');
var shell		= require('gulp-shell');

var closureCompiler = require('gulp-closure-compiler');

var helpMessages = {
	sass: 'Builds the owl-table SCSS file to dist folder.  Autoprefixes and minifies.',
	coffeeTests: 'Compiles E2E CoffeeScript tests into JS to run with Nightwatch.',
	vendor: 'Builds vendor.min.js from bower_components and lib folder.  Intended for development use.',
	watch: 'Main watch task for re-building dist files when source files change.',
	nightwatch: 'Runs E2E tests in continuous mode.',
	test: 'Runs full testing suite.  Executes gulp build before running.',
	karma: 'Runs unit test suite once.',
	watchCoffee: 'Watches for changes to E2E tests and executes coffee-tests.',
	testNightwatch: 'Runs E2E tests once after compiling CoffeeScript E2E tests.',
	build: 'Compiles JS and CSS to the dist folder.',
	clean: 'Cleans up build artifacts.'
};
// Build tasks

gulp.task('jsx', false, function () {
	return gulp.src(['./react_components/input.js', './react_components/cell.js', './react_components/row.js', './react_components/table.js'])
			.pipe(react())
			.pipe(concat('compiled-react-components.js'))
			.pipe(gulp.dest('./build'));
});

gulp.task('sass', helpMessages.sass, function () {
	return gulp.src('./sass/owl-table.scss')
			.pipe(sass({
				precision: 10,
				includePaths: [
					'bower_components/bootstrap-sass-official/assets/stylesheets'
				]
			}))
			.pipe(autoprefix({
				browsers: ['last 2 versions']
			}))
			.pipe(minifyCSS())
			.pipe(rename({
				extname: '.min.css'
			}))
			.pipe(gulp.dest('./dist'));
});

gulp.task('coffee', false, function () {
	return gulp.src(['./src/*.coffee', './src/**/*.coffee'])
		.pipe(coffee())
		.pipe(concat('compiled-coffee.js'))
		.pipe(gulp.dest('./build'));
});

gulp.task('coffee-tests', helpMessages.coffeeTests, function () {
	return gulp.src(['./tests/e2e/*.coffee', './tests/e2e/**/*.coffee'])
		.pipe(coffee())
		.pipe(rename({
			extname: '.js'
		}))
		.pipe(gulp.dest('./tests/e2e'));
});

gulp.task('js', false, function () {
	return gulp.src(['./src/directives/swiftbox.js', './src/*.js', './src/services/*.js', './src/directives/owlTable.js', './src/directives/owlCustomizeColumns.js', './src/directives/owlExportControls.js', './src/directives/owlFilterControls.js', './src/directives/owlPagination.js', './src/directives/owlPrint.js', './src/directives/owlSpinner.js', './src/directives/owlMassUpdate.js', './src/controllers/*.js'])
		.pipe(concat('compiled-js.js'))
		.pipe(gulp.dest('./build'));
});

gulp.task('partials', false, function () {
	return gulp.src('./views/*.jade')
		.pipe(jade())
		.pipe(minifyHtml({
			empty: true,
			spare: true,
			quotes: true
		}))
		.pipe(ngHtml2Js({
			moduleName: 'owlTablePartials',
			prefix: 'partials/'
		}))
		.pipe(concat('compiled-partials.js'))
		.pipe(gulp.dest('./build'));
});

gulp.task('closure', false, function () {
	return gulp.src(['./build/compiled-react-components.js', './build/compiled-js.js', './build/compiled-partials.js'])
		.pipe(closureCompiler({
			compilerPath: 'bower_components/closure-compiler/lib/vendor/compiler.jar',
			fileName: 'compiled.js',
			compilerFlags: {
				language_in: 'ECMASCRIPT5_STRICT',
				compilation_level: 'WHITESPACE_ONLY'
			}
		}))
		.pipe(gulp.dest('./build'));
});

gulp.task('compile', false, function (callback) {
	runSequence(['jsx', 'js', 'sass', 'coffee', 'partials'], callback);
});

gulp.task('concat', false, function () {
	return gulp.src(['./build/compiled-react-components.js', './build/compiled-js.js', './build/compiled-partials.js'])
		.pipe(concat('compiled.js'))
		.pipe(gulp.dest('./build'));
});

gulp.task('link', false, function () {
	return gulp.src([
		'./build/compiled.js'
	])
		.pipe(concat('owl-table.min.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('link-unminified', false, function () {
	return gulp.src(
		'./build/compiled.js'
	)
		.pipe(concat('owl-table.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('vendor', helpMessages.vendor, function () {
	return gulp.src([

		'./bower_components/jquery/jquery.js',
		'./bower_components/lodash/dist/lodash.min.js',
		'./bower_components/react/react-with-addons.js',
		'./bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
		'./bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js',

		'./bower_components/angular/angular.js',
		'./bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',

		'./bower_components/angular-animate/angular-animate.js',
		'./bower_components/angular-sanitize/angular-sanitize.js',
		'./bower_components/ng-csv/build/ng-csv.js',
		'./bower_components/ladda/dist/spin.min.js',
		'./bower_components/ladda/dist/ladda.min.js',
		'./bower_components/angular-ladda/dist/angular-ladda.min.js',
		'./bower_components/angular-ui-utils/ui-utils.min.js',

		'./lib/tacky.js'
	])
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('clean-build', false, function () {
	return (
		gulp.src(['./build/*.*', './build'])
		.pipe(clean())
	);
});

gulp.task('clean-dist', false, function () {
	return (
		gulp.src(['./dist/owl-table.min.js', './dist/owl-table.min.css'])
			.pipe(clean())
	);
});

gulp.task('clean-tests', false, function () {
	return (
		gulp.src(['./tests/e2e/*_spec.js', './tests/e2e/**/*_spec.js', './tests/unit/*_spec.js', './tests/unit/**/*_spec.js'])
			.pipe(clean())
	);
});

gulp.task('clean', helpMessages.clean, function (callback) {
	runSequence(['clean-build', 'clean-dist'], callback);
});

gulp.task('build-minified', function (callback) {
	runSequence('compile', 'closure', ['link', 'vendor'], 'clean-build', callback);
});

gulp.task('build-unminified', false, function (callback) {
	runSequence('compile', 'concat', ['link-unminified', 'vendor'], 'clean-build', callback);
});

gulp.task('build', helpMessages.build, function (callback) {
	runSequence('clean', 'build-minified', 'build-unminified', 'clean-build', callback);
});

gulp.task('build-release', false, function (callback) {
	runSequence('clean', 'compile', 'link', 'link-release', 'clean-build', callback);
});

// Watch tasks

gulp.task('watch', helpMessages.watch, function () {
	gulp.watch(['./src/*.js', './src/**/*.js', './views/*.jade', './react_components/*.js', './sass/*.scss', './sass/**/*.scss'], ['build']);
});

gulp.task('watch-coffee', helpMessages.watchCoffee, function (callback) {
	gulp.watch(['./tests/e2e/*.coffee'], ['coffee-tests']);
});

gulp.task('nightwatch', helpMessages.nightwatch, function (callback) {
	gulp.watch(['./tests/e2e/**/*.js'], ['test-nightwatch']);
});

// test tasks

gulp.task('test', helpMessages.test, function () {
	runSequence('build', 'karma', 'coffee-tests', 'test-nightwatch');
});

gulp.task('karma', helpMessages.karma, function (callback) {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, callback);
});

gulp.task('karma-sauce', false, function (callback) {
	karma.start({
		configFile: __dirname + '/karma.conf-ci.js',
		singleRun: true
	}, callback);
});

gulp.task('test-nightwatch', helpMessages.testNightwatch, shell.task(['nightwatch']));
gulp.task('nightwatch-sauce', false, shell.task(['nightwatch -e saucelabs']));

gulp.task('test-saucelabs', false, function (callback) {
	runSequence('build', 'karma-sauce', 'coffee-tests', 'nightwatch-sauce', callback);
});
