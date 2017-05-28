import app from './index';

describe('AppComponent', () => {
  let element;

  beforeEach(() => {
    angular.mock.module(app);

    angular.mock.inject(($rootScope, $compile) => {
      element = $compile("<app></app>")($rootScope)
      $rootScope.$digest();
    })      
  });

  it('should contain the sample text', () => {
    expect(element.html()).toContain('angular works!');
  });
});