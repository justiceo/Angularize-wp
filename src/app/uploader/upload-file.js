/**
 * todo: make me a component
 */
export class UploadFileCtrl {
    constructor($scope, Upload) {
        // upload later on form submit or something similar
        $scope.submit = function () {
            if ($scope.form.file.$valid && $scope.file) {
                $scope.upload($scope.file);
            }
        };

        // upload on file select or drop
        $scope.upload = function (file) {
            console.log("file to upload: ", file);
            Upload.upload({
                url: 'http://localhost/wp-json/wp/v2/media',
                method: 'POST',
                file: file,
                headers: {
                    "Content-Disposition": 'attachment; filename=' + file.name,
                    "content-type": "image/png",
                    "data-binary": file.name
                }
            })
            .then(function (resp) {
                console.log("f-success: ", resp);
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log("err: ", resp);
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };
        // for multiple files:
        $scope.uploadFiles = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    //Upload.upload({ ..., data: { file: files[i] }, ...})...;
                }
                // or send them all together for HTML5 browsers:
                //Upload.upload({ ..., data: { file: files }, ...})...;
            }
        }
    }
}

let UploadFile = {
    controller: UploadFileCtrl,
    template: require('./upload-file.html')
}

export default UploadFile;