import 'angular-ui-bootstrap';
import ngFileUpload from 'ng-file-upload';
import NewPost from './new-post';
import SimpleEditor from './simple-medium-editor';
import UploadFile from './upload-file';
import EditPost from './edit-post';
import Chips from './chips';

const cities = [];

let requires = ['ui.bootstrap', ngFileUpload];
let angularizeEditor = angular.module('angularizeEditor', requires);

// only load if we have wp front end editor enabled
//if(window.angularize_server.WpRestApiEnabled && window.angularize_server.FrontEndEditorEnabled)
angularizeEditor    
  .component('editPost', EditPost)
    .constant('ALL_CITIES', cities)
    .component('newPost', NewPost)
    .component('uploadFile', UploadFile)
    .component('simpleEditor', SimpleEditor)
    .component('chips', Chips)

export default angularizeEditor.name;