import angular from 'angular';
import './editor';
import './widgets';
import Cache from './providers/cache';
import PostService from './providers/post';
import Ajax from './providers/ajax';
import ToolbarService from './providers/toolbar.service';

import '../style/app.scss';

let requires = [
  'angularize.widgets',
  'angularize.editor',
];
let MODULE_NAME = 'angularize';
let angularize = angular.module(MODULE_NAME, requires);

// make module available on window object
window.angularize = angularize;
console.log("angularize_server: ", window.angularize_server);

// To prevent un-predictable behavior, only load when wp rest api is enabled
if(window.angularize_server.WpRestApiEnabled)
angularize
  .service('Cache', Cache)
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

export default MODULE_NAME;