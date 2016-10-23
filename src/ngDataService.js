(function() {
  'use strict';

  var VALID_URL_REGEIX = /^((http(s)?\:\/\/)|\/)/;

  var validateUrl = function(url) {
    if(!VALID_URL_REGEIX.test(url)) {
      var callee = arguments.callee.caller.toString();
      throw 'ngDataService' + callee + '(url) - provided url is invalid';
    }
  }

  var ngDataService = function() {
  };

  ngDataService.prototype.get = function(url) {
    validateUrl(url);
  }

  ngDataService.prototype.getLive = function(url) {
    validateUrl(url);
  }

  ngDataService.prototype.remove = function(url) {
    validateUrl(url);
  };

  ngDataService.prototype.removeAll = function() {

  };

  ngDataService.$inject = [];

  angular
    .module('ng-data-service', [])
    .service('ngDataService', ngDataService);
})();
