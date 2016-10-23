'use strict';
describe('ngDataService', function() {
  var $http, $root, service, call, $windowMock;

  var validUrl = '/some-test-url';
  var responseMock = { temp1: 123, temp2: 'asd' };
  var responseMockStringified = JSON.stringify(responseMock);

  // copy const, since not exported
  var CACHE_PREFIX = 'lsc_';

  beforeEach(module('ng-data-service'));

  beforeEach(function() {
    $windowMock = {
      localStorage: {
        setItem: function() {},
        getItem: function() {},
        removeItem: function() {},

        // mocked keys
        'lsc_/': 'test',
        'lsc_http://test': true,
        'lsc_invalid': 'invalid',
        invalid: false,
        123: null
      }
    };
  });

  beforeEach(function() {
    module(function($provide) {
      $provide.value('$window', $windowMock);
    });
  });

  beforeEach(inject(function(ngDataService, $rootScope) {
    service = ngDataService;
    $root = $rootScope;
  }));

  it('should exist', function() {
    expect(service).not.toBe(undefined);
  });

  it('should have valid API methods', function() {
    ['get', 'getLive', 'remove', 'removeAll'].map(function(method) {
      expect(typeof service[method]).toBe('function');
    });
  });

  // simple URL validation, otherwise string pattern validation is too complex
  // and only clusters the demo
  describe('get|getLive|remove(url) should accept only http/https or / prefixed strings', function() {
    var invalidUrl = [
      1, 0, -1, -1.11, 0.11, NaN, [], {}, null, undefined,
      '', '   ', 'asd', 'httpz', 'httzps', 'a/'
    ];

    var validUrl = [
      'http://', 'https://', '/'
    ];

    ['get', 'getLive', 'remove'].map(function(method) {
      invalidUrl.map(function(url) {
        it(method + '(' + url + ') with invalid url SHOULD throw', function() {
          expect(service[method].bind(service, url)).toThrow();
        });
      });

      validUrl.map(function(url) {
        it(method + '(' + url + ') with valid url SHOULD NOT throw', function() {
          expect(service[method].bind(service, url)).not.toThrow();
        });
      });
    });
  });

  describe('getLive(validUrl)', function() {
    beforeEach(inject(function($httpBackend) {
      $http = $httpBackend;
      call = $http.when('GET', validUrl).respond(responseMock);

      spyOn($windowMock.localStorage, 'setItem');
      spyOn(console, 'error');
    }));

    afterEach(function() {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

    it('should make an $http GET call', function() {
      $http.expectGET(validUrl);
      service.getLive(validUrl);
      $http.flush();
    });

    it('should return a promise', function() {
      var req = service.getLive(validUrl);
      expect(req).not.toBe(undefined);
      expect(typeof req.then).toBe('function');
      $http.flush();
    });

    it('should pass down errors and output them in the console', function() {
      call.respond(401, 'error');

      $http.expectGET(validUrl);
      var result = service.getLive(validUrl);

      result.catch(function(error) {
        expect(error.data).toBe('error');
        expect(error.status).toBe(401);
        expect(console.error).toHaveBeenCalled();
      });

      $http.flush();
    });

    it('should pass down response values properly', function() {
      $http.expectGET(validUrl);
      var result = service.getLive(validUrl);

      result.then(function(res) {
        expect(res.data).toEqual(responseMock);
      });

      $http.flush();
    });

    it('should not create duplicate requests while running', function() {
      var promise1 = service.getLive(validUrl);
      var promise2 = service.getLive(validUrl);
      var promise3 = service.getLive(validUrl);

      expect(promise2).toBe(promise1);
      expect(promise3).toBe(promise1);
      expect(promise2).toBe(promise3);

      $http.flush();
    });

    describe('successful responses should be cached in localStorage', function() {
      it('keys should have ' + CACHE_PREFIX + '<url> format', function() {
        var result = service.getLive(validUrl);
        result.then(function(res) {
          var expectedPrefix = CACHE_PREFIX + validUrl;

          expect(res.data).toEqual(responseMock);
          expect($windowMock.localStorage.setItem)
            .toHaveBeenCalledWith(expectedPrefix, responseMockStringified);
        });

        $http.flush();
      });
    });
  });

  describe('get(validUrl)', function() {
    beforeEach(inject(function($httpBackend) {
      $http = $httpBackend;
      call = $http.when('GET', validUrl).respond(responseMock);
    }));

    beforeEach(function() {
      spyOn(service, 'getLive');
      spyOn($windowMock.localStorage, 'getItem')
        .and.returnValue(responseMockStringified);
    });

    it('should always return a promise', function() {
      var result = service.get(validUrl);
      expect(result).not.toBe(undefined);
      expect(typeof result.then).toBe('function');
    });

    it('promise from cache should contain proper parsed data value', function(done) {
      service.get(validUrl)
        .then(function(res) {
          expect(res.data).toEqual(responseMock);
          done();
        });

      $root.$digest();
    });

    describe('when there is cache', function() {
      beforeEach(function() {
        service.get(validUrl);
        service.get(validUrl);
      });

      it('should always return cache and not call getLive()', function() {
        expect(service.getLive).not.toHaveBeenCalled();
        expect($windowMock.localStorage.getItem)
          .toHaveBeenCalledWith(CACHE_PREFIX + validUrl);

        expect($windowMock.localStorage.getItem.calls.count()).toBe(2);
      });
    });

    describe('when the cache is empty', function() {
      beforeEach(function() {
        $windowMock.localStorage.getItem
          .and.returnValue(undefined);

        service.get(validUrl);
      });

      it('getLive() should be called once', function() {
        expect($windowMock.localStorage.getItem)
          .toHaveBeenCalledWith(CACHE_PREFIX + validUrl);
        expect(service.getLive).toHaveBeenCalledWith(validUrl);

        expect($windowMock.localStorage.getItem.calls.count()).toBe(1);
        expect(service.getLive.calls.count()).toBe(1);
      });

      describe('get() is called again after caching', function() {
        beforeEach(function() {
          $windowMock.localStorage.getItem
            .and.returnValue(responseMockStringified);

          service.get(validUrl);
        });

        it('getLive() should not be called twice', function() {
          expect($windowMock.localStorage.getItem.calls.count()).toBe(2);
          expect(service.getLive.calls.count()).toBe(1);
        });
      });
    });

  });

  describe('remove(validUrl)', function() {
    beforeEach(function() {
      spyOn($windowMock.localStorage, 'removeItem');
      service.remove(validUrl);
    });

    it('should call localStorage.removeItem() once', function() {
      expect($windowMock.localStorage.removeItem.calls.count()).toBe(1);
      expect($windowMock.localStorage.removeItem)
        .toHaveBeenCalledWith(CACHE_PREFIX + validUrl);
    });
  });

  describe('removeAll()', function() {
    beforeEach(function() {
      spyOn($windowMock.localStorage, 'removeItem');
      service.removeAll();
    });

    it('should remove only elements with validly-formatted keys from localStorage', function() {
      expect($windowMock.localStorage.removeItem.calls.count()).toBe(2);
      expect($windowMock.localStorage.removeItem).toHaveBeenCalledWith('lsc_/');
      expect($windowMock.localStorage.removeItem).toHaveBeenCalledWith('lsc_http://test');
    });
  });
});
