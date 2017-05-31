import ngMaterial from 'angular-material';
import PostSettings from './settings/settings';
import EditorDirective from './editor';

let MODULE_NAME = "AngularizeEditor";

angular.module(MODULE_NAME, [
    ngMaterial,
    'material.svgAssetsCache',
  ])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
     .primaryPalette('purple')
     .accentPalette('indigo')
  })
    .directive('editable', EditorDirective)
    .component('postSettings', PostSettings)

export default MODULE_NAME;