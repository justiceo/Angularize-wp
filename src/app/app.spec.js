import angularize from './index';

describe('AppComponent', () => {
  let element;

  beforeEach(() => {
    angular.mock.module(angularize);

    angular.mock.inject(($rootScope, $compile) => {
      element = $compile("<app></app>")($rootScope)
      $rootScope.$digest();
    })      
  });

  it('should contain the sample text', () => {
    expect(element.html()).toContain('angular works!');
  });
});