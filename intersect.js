(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'angular'], factory);
    } else if (typeof exports === 'object') {
        factory(exports, require('angular'));
    } else {
        factory((root.commonJsStrict = {}), root.angular);
    }

}(this, function (intersect, angular) {
  var root = this,
      extendInjection = function (module, attribute) {
      var original = module[attribute];
      return (function (name, dependencies, fn) {
        if (typeof fn === 'function' && angular.isArray(dependencies)) {
          dependencies = angular.copy(dependencies);
          dependencies.push(fn);
        }
        return original.call(module, name, dependencies);
      });
    },

    getWrappedComponent = function (module) {
      return angular.extend({}, module, {
        provider: extendInjection(module, 'provider'),
        factory: extendInjection(module, 'factory'),
        service: extendInjection(module, 'service'),
        value: extendInjection(module, 'value'),
        constant: extendInjection(module, 'constant'),
        directive: extendInjection(module, 'directive'),
      });
    },

    getModuleComponent = function (componentType) {
      return (function (name, dependencies, fn) {
        var moduleIndex = name.indexOf(':'),
            module;

        if (moduleIndex === -1) moduleIndex = name.indexOf('.');

        // Assume module has same name as component
        if (moduleIndex === -1) moduleIndex = 0;

        module = intersect.module(name.slice(0, moduleIndex));
        return module[componentType](name, dependencies, fn);
      });
    };

  angular.extend(intersect, angular, {
    module: function () {
      var module = angular.extend({}, angular.module.apply(angular, arguments));
      return getWrappedComponent(module);
    },
    conflict: function (providedRoot) {
      if (typeof providedRoot === 'undefined') {
        providedRoot = root;
      }
      if (typeof root.angular !== 'undefined') {
        root.angular = intersect;
      }
    },
    provider: getModuleComponent('provider'),
    factory: getModuleComponent('factory'),
    service: getModuleComponent('service'),
    value: getModuleComponent('value'),
    constant: getModuleComponent('constant'),
    directive: getModuleComponent('directive'),
  });


  return intersect;
}));
