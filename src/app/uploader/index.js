import ngFileUpload from 'ng-file-upload';
import UploadFile from './upload-file';
import UploadFileDirective from './upload-filed';


let requires = [
    ngFileUpload,
];

let uploaderModule = angular.module('angularize.uploader', requires);

uploaderModule
    //.component('uploadFile', UploadFile)
    .directive('uploadFile', UploadFileDirective)

export default uploaderModule;