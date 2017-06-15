/*import ngMaterial from 'angular-material';
import svgAssetsCache from 'svg-assets-cache';
import PostSettings from './settings/settings';
import EditorDirective from './editor';
import Toolbar from './toolbar';
import NewPost from './new-post';
*/
import EditPostDirective from './edit-button';

let requires = []; // [ngMaterial, svgAssetsCache];
let editorModule = angular.module('angularize.editor', requires);


editorModule    
    .component('editPost', EditPostDirective)
/*
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
     .primaryPalette('purple')
     .accentPalette('indigo')
  })
    .directive('editable', EditorDirective)
    .component('postSettings', PostSettings)
    .component('toolbar', Toolbar)
    .component('newPost', NewPost)
*/
export default editorModule;