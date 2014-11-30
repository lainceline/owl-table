owl-table
=========

AngularJS table directive built with ReactJS for high performance

Demo: [http://onijim.github.io/owl-table](http://onijim.github.io/owl-table)

## Why?

I ran into performance issues with stock AngularJS doing ng-repeat on 1000+ data items.  I've come across many optimizations, some of which I will be using in this project.

Similar in concept to documentFragment, ReactJS uses a "shadow DOM" to do all of its rendering off screen.  When a change is pushed to the components, the view is flipped all at once to the real DOM.  This lets all of the heavy lifting occur in pure Javascript where it can be very fast, instead of manipulating the DOM in real-time which is slower.

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
11. jquery 1.11.x
12. shims for older IE

`gulp build` will create `vendor.min.js` in the dist folder if `bower install` has been run.  Or use your framework's asset pipeline.

Sorry for all the dependencies, this is an internal project that needs to do specific things.

## Installation

* `bower install owl-table --save`


```html
<link rel="stylesheet" href="bower_components/owl-table/dist/owl-table.min.css">

<style src="bower_components/owl-table/dist/vendor.min.js"></style>
<style src="bower_components/owl-table/dist/owl-table.min.js"></style>
```

## Use

```html
<owl-table data="data" columns="columns" options="options" owl-tacky="tackyOpts"> </owl-table>
```

Please see example index.html for now to see format of the various objects to pass in

## Things which are broke and/or coming soon
* Filtering
* Sorting
* Printing
* Change page though input field
* Settings panel for storing local display settings
* Swiftbox integration

## Dev installation

1. `git clone`
2. `npm install --require-dev`
3. `bower install --require-dev` if necessary
4. `gulp build` to build sass, interpret JSX, compile CoffeeScript, etc
5. `gulp watch` will rebuild everything when changes are detected
