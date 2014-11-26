'use strict';

var gulp 		= require('gulp');

var coffee 		= require('gulp-coffee');
var sass 		= require('gulp-sass');
var jade		= require('gulp-jade');
var react 		= require('gulp-react');
var ngHtml2Js 	= require('gulp-ng-html2js');

var minifyCSS 	= require('gulp-minify-css');
var minifyHtml 	= require('gulp-minify-html');
var uglify 		= require('gulp-uglify');

var karma 		= require('karma').server;
var protractor 	= require('gulp-protractor').protractor;

var rename 		= require('gulp-rename');
var runSequence	= require('run-sequence');
var concat 		= require('gulp-concat');
var clean		= require('gulp-clean');

// Build tasks

gulp.task('jsx', function () {
	return gulp.src(['./react_components/input.js', './react_components/cell.js', './react_components/row.js', './react_components/table.js'])
			.pipe(react())
			.pipe(concat('compiled-react-components.js'))
			.pipe(gulp.dest('./build'));
});

gulp.task('sass', function () {
	return gulp.src('./sass/*.scss')
			.pipe(sass())
			.pipe(minifyCSS())
			.pipe(rename({
				extname: '.min.css'
			}))
			.pipe(gulp.dest('./dist'));
});

gulp.task('coffee', function () {
	return gulp.src(['./src/*.coffee', './src/**/*.coffee'])
		.pipe(coffee())
		.pipe(concat('compiled-coffee.js'))
		.pipe(gulp.dest('./build'));
});

gulp.task('js', function () {
	return gulp.src(['./src/app.js', './src/constants.js', './src/service.js', './src/directive.js'])
		//.pipe(uglify())
		.pipe(concat('compiled-js.js'))
		.pipe(gulp.dest('./build'));
});

gulp.task('partials', function () {
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

gulp.task('compile', function (callback) {
	runSequence(['jsx', 'js', 'sass', 'coffee', 'partials'], callback);
});

gulp.task('link', function () {
	return gulp.src(['./build/compiled-react-components.js', './build/compiled-partials.js', './build/compiled-coffee.js', './build/compiled-js.js'])
		//	.pipe(uglify())
			.pipe(concat('owl-table.min.js'))
			.pipe(gulp.dest('./dist'));
});

gulp.task('vendor', function () {
	return gulp.src([

		'./bower_components/jquery/dist/jquery.js',
		'./bower_components/react/react-with-addons.min.js',

		'./bower_components/angular/angular.js',
		'./bower_components/ladda/dist/spin.min.js',
		'./bower_components/ladda/dist/ladda.min.js',
		'./bower_components/ladda/dist/angular-ladda.min.js',
		'./bower_components/angular-ui-utils/ui-utils.min.js',

	])
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('clean-build', function () {
	return (
		gulp.src(['./build/*.*', './build'])
		.pipe(clean())
	);
});

gulp.task('clean-dist', function () {
	return (
		gulp.src(['./dist/vendor.min.js', './dist/owl-table.min.js', './dist/owl-table.min.css'])
			.pipe(clean())
	);
});

gulp.task('clean', function (callback) {
	runSequence(['clean-build', 'clean-dist'], callback);
});

gulp.task('build', function (callback) {
	runSequence('clean', 'compile', ['link', 'vendor'], 'clean-build', callback);
});

// Watch tasks

gulp.task('watch', function (callback) {
	gulp.watch(['./src/*.js', './views/*.jade', './react_components/*.js', './sass/*.scss', './sass/**/*.scss'], ['build']);
});
