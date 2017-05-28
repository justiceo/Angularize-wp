import angular from 'angular';
import LocalStorageModule from 'angular-local-storage';
import Cache from './providers/cache';
import PostService from './providers/post';
import Ajax from './providers/ajax';
import AppComponent from './app';
import RecentPosts from './components/recent-posts/';

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
  .component('app', AppComponent)
  .component('recentPost', RecentPosts)
  //.directive('app', app)
  //.controller('AppCtrl', AppCtrl)  
  .service('Cache', Cache)
  .service('PostService', PostService)
  .service('Ajax', Ajax)
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

export default MODULE_NAME;