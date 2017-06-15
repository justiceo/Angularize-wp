import angular from 'angular';
import LocalStorageModule from 'angular-local-storage';
import './editor';
import './widgets';
import Cache from './providers/cache';
import PostService from './providers/post';
import Ajax from './providers/ajax';
import CurrentUser from './providers/current-user';
import ToolbarService from './providers/toolbar.service';
import AppComponent from './app';

import '../style/app.scss';

let requires = [
  LocalStorageModule,
  'angularize.widgets',
  'angularize.editor',
]
let angularize = angular.module('angularize', requires);

// make module available on window object
window.angularize = angularize;

// To prevent un-predictable behavior, only load when wp rest api is enabled
if(window.wp_rest_object.WpRestApiEnabled)
angularize
  .component('app', AppComponent)
  .service('Cache', Cache)
  .service('PostService', PostService)
  .service('Ajax', Ajax)
  .service('CurrentUser', CurrentUser)
  .service('ToolbarService', ToolbarService)
  .factory('httpRequestInterceptor', function ($window) {
    'ngInject';
    return {
      request: function (config) {
        if($window.wp_rest_object)        
          config.headers['X-WP-Nonce'] = $window.wp_rest_object.nonce;
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

export default angularize;