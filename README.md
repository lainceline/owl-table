owl-table
=========
[![Build Status](https://travis-ci.org/onijim/owl-table.svg?branch=develop)](https://travis-ci.org/onijim/owl-table)
[![Sauce Test Status](https://saucelabs.com/buildstatus/onijim_oss)](https://saucelabs.com/u/onijim_oss)
[![Code Climate](https://codeclimate.com/github/onijim/owl-table/badges/gpa.svg)](https://codeclimate.com/github/onijim/owl-table)
[![Test Coverage](https://codeclimate.com/github/onijim/owl-table/badges/coverage.svg)](https://codeclimate.com/github/onijim/owl-table)

[![David Dependencies](https://david-dm.org/onijim/owl-table.svg?style=flat)](https://david-dm.org/onijim/owl-table#info=dependencies&view=table)
[![David Dev Dependencies](https://david-dm.org/onijim/owl-table/dev-status.svg?style=flat)](https://david-dm.org/onijim/owl-table#info=devDependencies&view=table)

AngularJS table directive built with ReactJS for high performance

Demo: [http://onijim.github.io/owl-table](http://onijim.github.io/owl-table)

## Installation

* `bower install owl-table --save`


```html
<link rel="stylesheet" href="bower_components/owl-table/dist/owl-table.min.css">

<style src="bower_components/owl-table/dist/vendor.min.js"></style>
<style src="bower_components/owl-table/dist/owl-table.min.js"></style>
```

## Use

```html
<owl-table id="myTable" data="myCtrl.data" columns="myCtrl.columns" options="myCtrl.options"> </owl-table>
```

Please see index.html in the repository for an in-depth demo of usage.

## Why?

I ran into performance issues with stock AngularJS doing ng-repeat on 1000+ data items.  While researching optimizations,
I found that some people were using React to provide the views for their apps and directives.

## Dependencies
1. angular 1.3.x+
2. angular-animate
3. angular-sanitize
4. angular-ladda
5. spin.js
6. ladda.js
7. angular-ui-utils
8. ng-csv
9. react js with addons
10. lodash
11. jquery 1.7+
12. shims for older IE

`gulp build` will create `vendor.min.js` in the dist folder if `bower install` has been run.  Or use your framework's asset pipeline.

## To do
* Printing
* Change page though input field
* Settings panel for storing local display settings

## Dev installation

1. git clone the repo
2. `npm install --require-dev`
3. `bower install --require-dev`
4. `gulp build` to build sass, interpret JSX, compile CoffeeScript, etc
5. `gulp watch` will rebuild most everything on change
6. `gulp help` for task list and info

### Tests

`gulp nightwatch` to run e2e tests
`karma start` to run unit tests

Nightwatch is based on Jasmine and is reminiscent of codeception in its ease of use and readability.
angular-mocks is included in the bower dev requirements.

Project uses CoffeeScript for tests because of its Ruby-like syntax which just goes well with testing.
JSX is available in all CoffeeScript due to a drop-in replacement for `coffee()`

After running tests, code coverage information is available in `tests/coverage` (gitignored)

Project uses Travis CI and Sauce Labs for cloud continuous integration and testing.
