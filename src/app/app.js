import angular from 'angular';
import LocalStorageModule from 'angular-local-storage';
import Cache from './providers/cache';
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

angular.module(MODULE_NAME, ['LocalStorageModule'])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl)
  //.provider('Cache', Cache)
  .config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix(MODULE_NAME)
      .setStorageType('localStorage') // or sessionStorage
      .setNotify(true, true)
  });

export default MODULE_NAME;