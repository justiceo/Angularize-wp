import ngMaterial from 'angular-material';
import svgAssetsCache from 'svg-assets-cache';
import PostSettings from './settings/settings';
import EditorDirective from './editor';
import Toolbar from './toolbar';
import NewPost from './new-post';
import ngFileUpload from 'ng-file-upload';

import EditPostDirective from './edit-button';
import UploadFileDirective from './upload-file.js';

let requires = [ngMaterial, svgAssetsCache, ngFileUpload ];
let editorModule = angular.module('angularize.editor', requires);

// only load if we have wp front end editor enabled
//if(window.angularize_server.WpRestApiEnabled && window.angularize_server.FrontEndEditorEnabled)
editorModule    
  .component('editPost', EditPostDirective)
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
     .primaryPalette('purple')
     .accentPalette('indigo')
  })
    .directive('editable', EditorDirective)
    .directive('uploadFile', UploadFileDirective)
    .component('postSettings', PostSettings)
    .component('toolbar', Toolbar)
    .component('newPost', NewPost)

export default editorModule;