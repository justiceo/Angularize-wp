import PostService from './post';
import Ajax from './ajax';
import ToolbarService from './toolbar-service';
import Toolbar from './toolbar';
import RestApi from './rest-api';
import MockService from './mock';

let angularizeCore = angular.module('angularizeCore', [])

angularizeCore
  .component('toolbar', Toolbar)
  .service('PostService', PostService)
  .service('Ajax', Ajax)
  .service('ToolbarService', ToolbarService)
  .service('RestApi', RestApi)
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