describe('intersect', function () {
  var intersect = require('./intersect'),
      angular = require('angular'),
      sinon = require('sinon'),
      chai = require('chai'),
      
      wrappedComponentTypes = [
        'provider',
        'factory',
        'service',
        'value',
        'constant',
        'directive',
      ];


  beforeEach(function () {
    var module = angular.module('example', []),
        typeIndex, type, component;

    // Create an initial "example" module for working with before we
    // stub angular.module itself.
    this.natives = {
      module: module,
    };

    for (typeIndex in wrappedComponentTypes) {
      type = wrappedComponentTypes[typeIndex];
      this.natives[type] = module[type]('example.'+type, [], (function () {})),

      sinon
        .stub(this.natives.module, type)
        .returns(this.natives[type]);
    }

    sinon
      .stub(angular, 'module')
      .returns(module);
  });


  afterEach(function () {
    var typeIndex, type;
    for (typeIndex in wrappedComponentTypes) {
      type = wrappedComponentTypes[typeIndex];
      this.natives.module[type].restore();
    }
    angular.module.restore();
  });

  var componentType, componentTypeIndex;
  for (componentTypeIndex in wrappedComponentTypes) {
    componentType = wrappedComponentTypes[componentTypeIndex];
    describe('#' + componentType, function () {
      it('should automatically resolve modules', function () {
        var module = {},
            moduleSpy = sinon.stub(intersect, 'module').returns(module),
            componentName = 'example.things.fakeProvider',
            providerSpy;

        module[componentType] = (function () {});
        providerSpy = sinon.stub(module, componentType);

        intersect[componentType](componentName);

        chai
          .expect(intersect.module.calledWith('example'))
          .to.equal(true);

        chai
          .expect(module[componentType].calledWith(componentName))
          .to.equal(true);

        providerSpy.restore()
        moduleSpy.restore();
      });
    });
  }

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
      var typeIndex, type;

      for (typeIndex in wrappedComponentTypes) {
        (function(type) {
          describe('#' + type, function () {
            beforeEach(function () {
              this.dependencies = ['a', 'b']
              this.definition = (function () {});
              this.module = intersect.module('example');
              this.componentName = 'example.' + type;

              this.expectation = [
                'example.' + type,
                ['a', 'b', this.definition]
              ]
            });

            it('should support all standard angular interfaces', function () {
              this.module[type](
                this.componentName,
                this.dependencies.concat(this.definition)
              );

              chai
                .expect(this.natives.module[type].lastCall.args)
                .to.deep.equal(this.expectation)

              this.module[type](
                this.componentName,
                this.definition
              );

              chai
                .expect(this.natives.module[type].lastCall.args)
                .to.deep.equal([this.componentName, this.definition])
            });

            it('should support trailing function for injections', function () {
              this.module[type](
                this.componentName,
                this.dependencies,
                this.definition
              );

              chai
                .expect(this.natives.module[type].lastCall.args)
                .to.deep.equal(this.expectation)
            });
          });
        })(wrappedComponentTypes[typeIndex]);
      }
    });
  });
});
