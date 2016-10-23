describe('ngDataService', function() {
  var service;

  beforeEach(module('ng-data-service'));
  beforeEach(inject(function(ngDataService) {
    service = ngDataService;
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
        it(method + '(url) with invalid url SHOULD throw', function() {
          expect(service[method].bind(service, url)).toThrow();
        });
      });

      validUrl.map(function(url) {
        it(method + '(url) with valid url SHOULD NOT throw', function() {
          expect(service[method].bind(service, url)).not.toThrow();
        });
      });
    });
  });

  describe('getLive(validUrl)', function() {
    var $http, call;
    var validUrl = '/some-test-url';
    var response = { test: 123 };

    beforeEach(inject(function($httpBackend) {
      $http = $httpBackend
      call = $http.when('GET', validUrl).respond(response);
    }));

    afterEach(function() {
      $http.flush();
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

    it('should make an $http GET call', function() {
      $http.expectGET(validUrl);
      service.getLive(validUrl);
    });

    it('should return a promise', function() {
      var req = service.getLive(validUrl);
      expect(req).not.toBe(undefined);
      expect(typeof req.then).toBe('function');
    });

    it('should be able to catch errors', function(done) {
      call.respond(401, 'error');
      $http.expectGET(validUrl);
      service.getLive(validUrl).catch(function(err) {
        expect(err).toBe('error');
        done();
      });
    });
  });
});
