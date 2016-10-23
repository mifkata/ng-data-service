describe('ngDataService', function() {
  var service;

  beforeEach(module('ng-data-service'));
  beforeEach(inject(function(ngDataService) {
    service = ngDataService;
  }));

  it('should exist', function() {
    expect(service).not.toBe(undefined);
  });
});
