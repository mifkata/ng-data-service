function ngDataService(angular) {
  const CACHE_PREFIX = 'lsc_';
  const CACHE_REGEX = /^lsc_(\/|https?:\/\/)/i;
  const URL_REGEX = /^(\/|https?:\/\/)/i;
  
  // map of ongoing requests
  const runningQueries = {};
  
  class NgDataService {
    constructor($http, $window) {
      this.$http = $http;
      this.storage = $window.localStorage;
    };
  
    isValidUrl(url) {
      return URL_REGEX.test(url);
    }
  
    get(url) {
      if(!this.isValidUrl(url)) {
        throw new Error(`NgDataService.get(url), invalid url: ${url}`);
      }
  
      const cached = this.storage.getItem(CACHE_PREFIX + url);
      if(cached) {
        return Promise.resolve({ data: JSON.parse(cached) });
      }
  
      return this.getLive(url);
    }
  
    getLive(url) {
      if(!this.isValidUrl(url)) {
        throw new Error(`NgDataService.getLive(url), invalid url: ${url}`);
      }
  
      if(!runningQueries.hasOwnProperty(url)) {
        runningQueries[url] = this.$http.get(url)
          .then(this.onRequestSuccess.bind(this, url))
          .catch(this.onRequestError.bind(this, url));
      }
  
      return runningQueries[url];
    }
  
    remove(url) {
      if(!this.isValidUrl(url)) {
        throw new Error(`NgDataService.remove(url), invalid url: ${url}`);
      }
  
      this.storage.removeItem(CACHE_PREFIX + url);
    };
  
    removeAll() {
      for(let item in this.storage) {
        if(CACHE_REGEX.test(item)) {
          this.storage.removeItem(item);
        }
      }
    }
  
    onRequestSuccess(url, value) {
      delete runningQueries[url];
      this.storage.setItem(CACHE_PREFIX + url, JSON.stringify(value.data));
  
      return value;
    }
    
    onRequestError(url, error, status) {
      delete runningQueries[url];
      console.error('HTTP GET [' + url + '] failed with status code ' + status);
  
      return error;
    }
  }
  
  NgDataService.$inject = ['$http', '$window'];
  
  return angular.module('ng-data-service', [])
    .service('ngDataService', NgDataService);
}

try {
  if(exports) {
    exports = ngDataService;
  } else if(module && module.exports) {
    module.exports = ngDataService;
  }
} catch(e) {
  ngDataService(angular);
}