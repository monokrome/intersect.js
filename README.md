intersect.js
============

Some thin wrappers around Spine.js + Backbone.js


Concept
-------

This is a simple library which wraps the Angular module system to provide
better injection behavior. Instead of the standard Angular way, it allows you
to define a service like this:

```javascript
angular.module('example')
	.service('example.services.one', ['x', 'y', 'z'], function (x, y, z) {});

```

This might seem like a little change, but it causes Angular to seem more
conventional in terms of CommonJS as well as provides the nice benefit that you
don't need to keep a function inside of an array (which is a bit peculiar).
This is especially useful in CoffeeScript, due to the following syntax being
possile:

```coffee
angular.module 'example'
	.service 'example.services.one', [
		'x'
		'y'
		'z'

	], (x, y, z) ->

```

This library aims to maintain 100% backwards compatibility with Angular. A
benefit of this goal is that (if you would like to), you can call the following
function in order to patch intersect into angular itself (although this is not
recommended) if necessary:

```javascript
intersect.conflict();

```

Intersect.JS will also respond properly to being used in an AMD, CommonJS, or
NodeJS environment. This means that you wont have any pesky global `interface`
variable sitting around if you are using a module loader.


TODO
----

On top of this, a few new goodies are planned. The final interface is expected
to look like so in JavaScript:

```javascript
// This service becomes: 'example.service.one'
intersect.module('example')
	.service('one', [
		'example.service.two',
		'some.service.somewhere',
		'some.controller.elsewhere'

	], function ($injected) {
		console.log($injected.another);
		console.log($injected.somewhere);
		console.log($injected.elsewhere);
	});

```

or in CoffeeScript:

```coffee
# This service becomes: 'example.service.one'
intersect.module 'example'
    .service 'one', [
        'example.service.two'
        'some.service.somewhere'
        'some.controller.elsewhere'
        
    ], ($injected) ->
        console.log $injected.another
        console.log $injected.somewhere
        console.log $injected.elsewhere

```
