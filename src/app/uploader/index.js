import ngFileUpload from 'ng-file-upload';

let requires = [
    ngFileUpload,
];

let uploaderModule = angular.module('angularize.uploader', requires);


export default uploaderModule;