(function() {
  'use strict';

  // @angular
  ngDataService.$inject = ['$http', '$window', '$q'];

  angular
    .module('ng-data-service', [])
    .service('ngDataService', ngDataService);

  // @constants
  var VALID_URL_REGEIX = /^((http(s)?\:\/\/)|\/)/;
  var CACHE_PREFIX = 'lsc_';
  var CACHE_REGEX = /^lsc_((http(s)?\:\/\/)|\/)/;

  // @private
  function validateUrl(url) {
    if(!VALID_URL_REGEIX.test(url)) {
      var callee = arguments.callee.caller.toString();
      throw 'ngDataService' + callee + '(url) - provided url is invalid';
    }
  }

  function onRequestSuccess(url, value) {
    this.storage.setItem(CACHE_PREFIX + url, JSON.stringify(value));
    return value;
  }

  function onRequestError(url, error, status) {
    console.error('HTTP GET [' + url + '] failed with status code ' + status);
    return error;
  }

  // @constructor
  function ngDataService($http, $window, $q) {
    this.$http = $http;
    this.storage = $window.localStorage;
    this.$q = $q;
  };

  ngDataService.prototype.get = function(url) {
    validateUrl(url);

    var cached = this.storage.getItem(CACHE_PREFIX + url);
    if(cached) {
      var deferred = this.$q.defer();
      var resolution = {
        data: JSON.parse(cached)
      };

      deferred.resolve(resolution);
      return deferred.promise;
    }

    return this.getLive(url);
  }

  ngDataService.prototype.getLive = function(url) {
    validateUrl(url);

    return this.$http
      .get(url)
      .success(onRequestSuccess.bind(this, url))
      .error(onRequestError.bind(this, url));
  }

  ngDataService.prototype.remove = function(url) {
    validateUrl(url);
    this.storage.removeItem(CACHE_PREFIX + url);
  };

  ngDataService.prototype.removeAll = function() {
    for(var item in this.storage) {
      if(CACHE_REGEX.test(item)) {
        this.storage.removeItem(item);
      }
    }
  };
})();
