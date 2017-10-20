import ToolbarService from './toolbar-service';
import MockService from './mock-service';
import RestApiService from './rest-api-service';
import TestComponent from './smoke-test/test-component';

let angularizeCore = angular.module('angularizeCore', [])

// comment-out this line to stop printing debug messages in console
console.debug = console.log;
// using console.table -- real cool!
// https://blog.mariusschulz.com/2013/11/13/advanced-javascript-debugging-with-consoletable
// using colors in console -- another cooly!
// https://i.stack.imgur.com/DFJBd.png

angularizeCore
  .component('test', TestComponent)
  .service('ToolbarService', ToolbarService)
  .service('RestApi', RestApiService)
  .service('MockService', MockService)
  .factory('httpRequestInterceptor', function ($log, $q, MockService) {
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
    $httpProvider.interceptors.push('$log', '$q', 'MockService', 'httpRequestInterceptor');
  });

  export default angularizeCore.name;