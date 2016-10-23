(function() {
  'use strict';

  // @angular
  ngDataService.$inject = ['$http'];

  angular
    .module('ng-data-service', [])
    .service('ngDataService', ngDataService);

  // @constants
  var VALID_URL_REGEIX = /^((http(s)?\:\/\/)|\/)/;
  var CACHE_PREFIX = 'lsc_';

  // @private
  function validateUrl(url) {
    if(!VALID_URL_REGEIX.test(url)) {
      var callee = arguments.callee.caller.toString();
      throw 'ngDataService' + callee + '(url) - provided url is invalid';
    }
  }

  function onSuccess(url, value) {
  }

  function onError(url, error, status) {
    throw 'HTTP GET ' + url + ' failed with status code ' + status;
  }

  // @constructor
  function ngDataService($http) {
    this.$http = $http;
  };

  ngDataService.prototype.get = function(url) {
    validateUrl(url);
  }

  ngDataService.prototype.getLive = function(url) {
    validateUrl(url);

    return this.$http
      .get(url)
      .success(onSuccess.bind(this, url))
      .error(onError.bind(this, url));
  }

  ngDataService.prototype.remove = function(url) {
    validateUrl(url);
  };

  ngDataService.prototype.removeAll = function() {

  };
})();
