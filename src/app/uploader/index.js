import ngFileUpload from 'ng-file-upload';
import UploadFile from './upload-file';

let requires = [
    ngFileUpload,
];

let uploaderModule = angular.module('angularize.uploader', requires);

uploaderModule
    .component('uploadFile', UploadFile)

export default uploaderModule;