describe('TestComponent', function() {
  var element, scope;
  
  beforeEach(function() {
    module('angularize');

    inject(function($rootScope, $compile) {
      element = $compile("<test></test>")($rootScope)
      $rootScope.$digest();
    })      
  });

  it('should contain the sample text', function() {
    expect(element.html()).toContain('angular works!');
  });
});