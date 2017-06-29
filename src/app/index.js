import angular from 'angular';
import LocalStorageModule from 'angular-local-storage';
import './editor';
import './widgets';
import './uploader';
import Cache from './providers/cache';
import PostService from './providers/post';
import Ajax from './providers/ajax';
import CurrentUser from './providers/current-user';
import ToolbarService from './providers/toolbar.service';

import '../style/app.scss';

let requires = [
  LocalStorageModule,
  'angularize.widgets',
  'angularize.editor',
  'angularize.uploader',
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
  .service('CurrentUser', CurrentUser)
  .service('ToolbarService', ToolbarService)
  .factory('httpRequestInterceptor', function ($window) {
    'ngInject';
    return {
      request: function (config) {
        if($window.angularize_server)        
          config.headers['X-WP-Nonce'] = $window.angularize_server.nonce;
        return config;
      }
    };
  })
  .config(function (localStorageServiceProvider, $httpProvider) {
    localStorageServiceProvider
      .setPrefix(MODULE_NAME)
      .setStorageType('localStorage') // or sessionStorage
      .setNotify(true, true);

    $httpProvider.interceptors.push('httpRequestInterceptor')
  });

export default MODULE_NAME;