owl-table
=========

AngularJS table directive built with ReactJS for high performance

## Why?

I ran into performance issues with stock AngularJS doing ng-repeat on 1000+ data items.  I've come across many optimizations, some of which I will be using in this project.

Similar in concept to documentFragment, ReactJS uses a "shadow DOM" to do all of its rendering off screen.  When a change is pushed to the components, the view is flipped all at once to the real DOM.  This lets all of the heavy lifting occur in pure Javascript where it can be very fast, instead of manipulating the DOM in real-time which is slower.

It's kinda like DirectX or OpenGL where you render all of your objects on an off-screen buffer and then flip it over on the next frame.

## Dev installation

1. `git clone`
2. `npm install --require-dev`
3. `bower install --require-dev` if necessary
4. `gulp build` to build sass, interpret JSX, compile CoffeeScript, etc
