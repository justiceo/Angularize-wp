import PostService from './post';
import Ajax from './ajax';
import ToolbarService from './toolbar-service';
import Toolbar from './toolbar';

let angularizeCore = angular.module('angularizeCore', [])

angularizeCore
  .component('toolbar', Toolbar)
  .service('PostService', PostService)
  .service('Ajax', Ajax)
  .service('ToolbarService', ToolbarService)
  .factory('httpRequestInterceptor', function () {
    return {
      request: function (config) {
        if(window.angularize_server)        
          config.headers['X-WP-Nonce'] = window.angularize_server.nonce;
        return config;
      }
    };
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor')
  });

  export default angularizeCore.name;