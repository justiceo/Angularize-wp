import 'angular-ui-bootstrap';
import ngFileUpload from 'ng-file-upload';
import NewPost from './new-post';
import SimpleEditor from './simple-medium-editor';
import FullEditor from './full-medium-editor';
import UploadFile from './upload-file';
import Chips from './chips';

let requires = ['ui.bootstrap', ngFileUpload];
let angularizeEditor = angular.module('angularizeEditor', requires);

// only load if we have wp front end editor enabled
//if(window.angularize_server.WpRestApiEnabled && window.angularize_server.FrontEndEditorEnabled)
angularizeEditor
    .component('newPost', NewPost)
    .component('uploadFile', UploadFile)
    .component('simpleEditor', SimpleEditor)
    .component('fullEditor', FullEditor)
    .component('chips', Chips)

export default angularizeEditor.name;