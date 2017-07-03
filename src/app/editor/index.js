import typeahead from 'angular-ui-bootstrap/src/typeahead';
import tooltip from 'angular-ui-bootstrap/src/tooltip';
import ngFileUpload from 'ng-file-upload';
import Toolbar from './toolbar';
import NewPost from './new-post';
import SimpleEditor from './simple-medium-editor';
import UploadFile from './upload-file';
import EditPost from './edit-post';
import Chips from './chips';

let cities = [];

let requires = [typeahead, tooltip, ngFileUpload];
let editorModule = angular.module('angularize.editor', requires);

// only load if we have wp front end editor enabled
//if(window.angularize_server.WpRestApiEnabled && window.angularize_server.FrontEndEditorEnabled)
editorModule    
  .component('editPost', EditPost)
    .constant('ALL_CITIES', cities)
    .component('toolbar', Toolbar)
    .component('newPost', NewPost)
    .component('uploadFile', UploadFile)
    .component('simpleEditor', SimpleEditor)
    .component('chips', Chips)

export default editorModule;