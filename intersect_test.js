describe('intersect', function () {
  var intersect = require('./intersect'),
      angular = require('angular'),
      sinon = require('sinon'),
      chai = require('chai'),
      
      wrappedComponentTypes = [
        'service',
        'factory',
      ];


  beforeEach(function () {
    var module = angular.module('example', []),
        service = module.service('example.service', [], (function () {})),
        factory = module.service('example.factory', [], (function () {})),
        typeIndex, type;

    // Create an initial "example" module for working with before we
    // stub angular.module itself.
    this.natives = {
      module: module,
      service: service,
      factory: factory
    };

    for (typeIndex in wrappedComponentTypes) {
      type = wrappedComponentTypes[typeIndex];

      sinon
        .stub(this.natives.module, type)
        .returns(this.natives[type]);
    }

    sinon
      .stub(angular, 'module')
      .returns(module);
  });


  afterEach(function () {
    this.natives.module.service.restore();
    angular.module.restore();
  });

  describe('$injector', function () {
    it('should call angular.module with expected arguments', function () {
      chai
        .expect(angular.module.called)
        .to.equal(false);

      intersect.module('example');
      chai
        .expect(angular.module.lastCall.calledWith('example'))
        .to.equal(true);

      intersect.module('example', ['example']);
      chai
        .expect(angular.module.lastCall.calledWith('example', ['example']))
        .to.equal(true);
    });


    describe('returned value', function () {
      it('should support trailing function for injections', function () {
        var dependencies = ['a', 'b'],
            definition = (function () {}),
            module = intersect.module('example'),
            nativeModule = angular.module('example'),
            expectation, typeIndex, type;

        for (typeIndex in wrappedComponentTypes) {
          type = wrappedComponentTypes[typeIndex];

          expectation = [
            'example.'+type,
            ['a', 'b', definition]
          ];

          module[type]('example.'+type, dependencies, definition);
          chai
            .expect(nativeModule[type].lastCall.args)
            .to.deep.equal(expectation);
        }
      });
    });
  });
});
