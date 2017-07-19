import PostService from './post';
import Ajax from './ajax';
import ToolbarService from './toolbar-service';
import Toolbar from './toolbar';
import RestApi from './rest-api';
import MockService from './mock';

let angularizeCore = angular.module('angularizeCore', [])
let devServer = 'http://localhost:8080';

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
        if(rejection.status == 404 && window.location.origin == devServer){
          return MockService.resolve(rejection)        
        }

        return $q.reject(rejection)
      }
    };
  })
  .config(function ($httpProvider, $logProvider) {
    $httpProvider.interceptors.push('$q', 'MockService', 'httpRequestInterceptor');
    if(window.location.origin !== devServer)
      $logProvider.debugEnabled(false); // sadly debug is only printed in firefox
  });

  export default angularizeCore.name;