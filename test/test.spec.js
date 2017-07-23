describe('TestComponent', function() {
  var element, scope;
  
  /*beforeEach(function() {
    angular.mock.module('angularize');

    angular.mock.inject(function($rootScope, $compile) {
      element = $compile("<test></test>")($rootScope)
      console.log("element: ", element)
      $rootScope.$digest();
    })      
  });*/

  beforeEach( module('angularize'))

  beforeEach( inject( function($rootScope, $compile){
    element = $compile('<test></test>')($rootScope);
    $rootScope.$digest();
  }));

  it('should contain the sample text', function() {
    expect(element.html()).toContain('angular works!');
  });
});