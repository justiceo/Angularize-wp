import ToolbarService from './toolbar-service';
import MockService from './mock-service';
import RestApiService from './rest-api-service';
import Toolbar from './toolbar-component';
import TestComponent from './smoke-test/test-component';

let angularizeCore = angular.module('angularizeCore', [])

angularizeCore
  .component('toolbar', Toolbar)
  .component('test', TestComponent)
  .service('ToolbarService', ToolbarService)
  .service('RestApi', RestApiService)
  .service('MockService', MockService)
  .factory('httpRequestInterceptor', function ($q, MockService) {
    return {
      request: function (config) {
        if(window.angularize_server)        
          config.headers['X-WP-Nonce'] = window.angularize_server.nonce;
        return config;
      },
      responseError: function(rejection) {
        // if it's 404 due to running on webpack instead of as WordPress plugin, mock the response.
        if(rejection.status == 404 && MockService.isDev){
          return MockService.resolve(rejection)        
        }

        return $q.reject(rejection)
      }
    };
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('$q', 'MockService', 'httpRequestInterceptor');
  });

  export default angularizeCore.name;