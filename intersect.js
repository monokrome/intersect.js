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
        service: extendInjection(module, 'service'),
        factory: extendInjection(module, 'factory'),
        provider: extendInjection(module, 'provider')
      });
    };

  angular.extend(intersect, angular);
  angular.extend(intersect, {
    module: function () {
      var module = angular.extend({}, angular.module.apply(angular, arguments));
      return getWrappedComponent(module);
    },
    conflict: function (providedRoot) {
      if (typeof providedRoot === 'undefined') {
        providedRoot = root;
      }
      root.angular = intersect;
    }
  });

  return intersect;
}));
