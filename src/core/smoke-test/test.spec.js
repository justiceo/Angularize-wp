import angularize from '../../index';

describe('TestComponent', () => {
  let element;

  beforeEach(() => {
    angular.mock.module(angularize);

    angular.mock.inject(($rootScope, $compile) => {
      element = $compile("<test></test>")($rootScope)
      $rootScope.$digest();
    })      
  });

  it('should contain the sample text', () => {
    expect(element.html()).toContain('angular works!');
  });
});