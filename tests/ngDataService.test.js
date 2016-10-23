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
});
