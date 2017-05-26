import angular from 'angular';
import LocalStorageModule from 'angular-local-storage';

import '../style/app.css';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor() {
    this.url = 'https://github.com/preboot/angular-webpack';
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, ['LocalStorageModule'])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl)
  .config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix(MODULE_NAME)
      .setStorageType('localStorage') // or sessionStorage
      .setNotify(true, true)
  });

export default MODULE_NAME;