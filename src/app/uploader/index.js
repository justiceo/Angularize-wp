import ngFileUpload from 'ng-file-upload';
import UploadFileDirective from './upload-file';


let requires = [
    ngFileUpload,
];

let uploaderModule = angular.module('angularize.uploader', requires);

uploaderModule
    .directive('uploadFile', UploadFileDirective)

export default uploaderModule;