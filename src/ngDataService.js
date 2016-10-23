(function() {
  'use strict';

  // @angular
  ngDataService.$inject = ['$http'];

  angular
    .module('ng-data-service', [])
    .service('ngDataService', ngDataService);

  // @constants
  var VALID_URL_REGEIX = /^((http(s)?\:\/\/)|\/)/;

  // @private
  var validateUrl = function(url) {
    if(!VALID_URL_REGEIX.test(url)) {
      var callee = arguments.callee.caller.toString();
      throw 'ngDataService' + callee + '(url) - provided url is invalid';
    }
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
    this.$http.get(url);
  }

  ngDataService.prototype.remove = function(url) {
    validateUrl(url);
  };

  ngDataService.prototype.removeAll = function() {

  };
})();
