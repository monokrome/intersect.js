intersect.js
============

[![Build Status](https://travis-ci.org/monokrome/intersect.js.svg?branch=master)](https://travis-ci.org/monokrome/intersect.js)

Some thin wrappers around Angular.js


Concept
-------

This is a simple library which wraps the Angular module system to provide
better injection behavior. Instead of the standard Angular way, it allows you
to define a service like this:

```javascript
intersect.module('example')
	.service('example.services.one', ['x', 'y', 'z'], function (x, y, z)
	{});
```

This is a common - but a bit redundant - pattern in Angular. Intersect can get
rid of this boilerplate because the service starts with module name followed by
a dot.

```javascript
intersect.service('example.services.one', ['x', 'y', 'z'], function (x, y, z) {});
```

This might seem like a small change, but it is a bit more convenient when
creating new Angular components. You don't need to keep your component
construction function inside of an array any more, and defining a new component
doesn't require getting a reference to the module that it was created within.

The module `example` is expected to already exist, and intersect will prepare
the reference for you.

This library aims to maintain 100% backwards compatibility with Angular. A
benefit of this goal is that (if you would like to), you can call the following
function in order to patch intersect into angular itself (although this is not
recommended) if necessary:

```javascript
intersect.conflict();
```

Intersect.JS will also respond properly to being used in an AMD, CommonJS, or
NodeJS environment. This means that you wont have any pesky global `intersect`
variable sitting around if you are using a module loader.

Here's an example in CoffeeScript as well:

```coffee
intersect.service 'example.services.one', [
  'example.services.x'
  'example.services.y'
  'example.services.z'

], (x, y, z) ->
```

Another way to organize a service in CoffeeScript could look like this:

```coffee
intersect.service 'example.services.one', class ExampleService
  @$inject: [
    'example.services.x'
    'example.services.y'
    'example.services.z'
  ]
  
  constructor: (x, y, z) ->
```
