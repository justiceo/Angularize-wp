import typeahead from 'angular-ui-bootstrap/src/typeahead';
import ngFileUpload from 'ng-file-upload';
import EditorDirective from './editor';
import Toolbar from './toolbar';
import NewPost from './new-post';
import SimpleEditor from './simple-medium-editor';
import UploadFile from './upload-file';

import EditPostDirective from './edit-button';

let cities = [];

let requires = [typeahead, ngFileUpload];
let editorModule = angular.module('angularize.editor', requires);

// only load if we have wp front end editor enabled
//if(window.angularize_server.WpRestApiEnabled && window.angularize_server.FrontEndEditorEnabled)
editorModule    
  .component('editPost', EditPostDirective)
    .directive('editable', EditorDirective)
    .constant('ALL_CITIES', cities)
    .component('toolbar', Toolbar)
    .component('newPost', NewPost)
    .component('uploadFile', UploadFile)
    .component('simpleEditor', SimpleEditor);

export default editorModule;