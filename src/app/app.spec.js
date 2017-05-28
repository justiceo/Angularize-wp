
// re-write tests from https://puigcerber.com/2016/02/07/how-to-test-angular-1-5-components/
import app from './app';

describe('app', () => {

  describe('AppCtrl', () => {
    let ctrl;

    beforeEach(() => {
      angular.mock.module(app);

      angular.mock.inject(($controller) => {
        ctrl = $controller('AppCtrl', {});
      });
    });

    it('should contain the sample text', () => {
      expect(ctrl.sample).toBe('angular works!');
    });
  });
});