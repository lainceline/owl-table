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

I ran into performance issues with stock AngularJS doing ng-repeat on 1000+ data items.  I've come across many optimizations, some of which I will be using in this project.

Similar in concept to documentFragment, ReactJS uses a fake DOM to do all of its rendering off screen.  When a change is pushed to the components, the view is flipped all at once to the real DOM.  This lets all of the heavy lifting occur in pure Javascript where it can be very fast, instead of manipulating the DOM in real-time which is slower.

It's kinda like DirectX or OpenGL where you render all of your objects on an off-screen buffer and then flip it over on the next frame.

## Dependencies
1. angular 1.3.2+
2. angular-animate
3. angular-sanitize
4. angular-ladda
5. spin.js
6. ladda.js
7. angular-ui-utils
8. ng-csv
9. react js with addons
10. lodash
11. jquery
12. shims for older IE

`gulp build` will create `vendor.min.js` in the dist folder if `bower install` has been run.  Or use your framework's asset pipeline.

## To do
* Filtering
* Printing
* Change page though input field
* Settings panel for storing local display settings

## Dev installation

1. git clone the repo
2. `npm install --require-dev`
3. `bower install --require-dev`
4. `gulp build` to build sass, interpret JSX, compile CoffeeScript, etc
5. `gulp watch` will rebuild most everything on change

### Tests

`gulp nightwatch` to run e2e tests
`karma start` to run unit tests

Nightwatch is based on Jasmine and is reminiscent of codeception in its ease of use and readability.
angular-mocks is included in the bower dev requirements.

Project uses CoffeeScript for tests because of its Ruby-like syntax which just goes well with testing.
JSX is available in all CoffeeScript due to a drop-in replacement for `coffee()`

After running tests, code coverage information is available in `tests/coverage` (gitignored)

Project uses Travis CI and Sauce Labs for cloud continuous integration and testing.
