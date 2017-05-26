import angular from 'angular';
import LocalStorageModule from 'angular-local-storage';
import Cache from './providers/cache';
import PostService from './providers/post';
import Ajax from './providers/ajax';
import AppCtrl from './app.controller';

import '../style/app.css';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [
  LocalStorageModule
  ])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl)  
  .service('Cache', Cache)
  .service('PostService', PostService)
  .service('Ajax', Ajax)
  factory('httpRequestInterceptor', function () {
    return {
      request: function (config) {

        
        config.headers['X-WP-Nonce'] = 'some data here';

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