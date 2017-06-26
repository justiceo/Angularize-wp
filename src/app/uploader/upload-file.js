/**
 * todo: make me a component
 */
export class UploadFileCtrl {
    constructor($scope, Upload) {
        // upload later on form submit or something similar
        this.Upload = Upload;
        this.$scope = $scope;
        $scope.submit = function () {
            if ($scope.form.file.$valid && $scope.file) {
                this.upload($scope.file);
            }
        };
    }

    upload(file, alt_text = "", caption = "") {
            let mediaUrl = 'http://localhost/wp-json/wp/v2/media'
            this.Upload.upload({
                url: mediaUrl,
                method: 'POST',
                file: file,
                headers: {
                    "Content-Disposition": 'attachment; filename=' + file.name,
                    "Content-Type": file.type,
                    "Cache-Control": "no-cache",
                    "Data-Binary": file.name
                },
                data: {
                    'caption': caption,
                    'alt_text': alt_text
                }
            })
            .then((resp) => {
                this.fileUrl = resp.data.source_url;
                console.log('Success ' + resp.data.title.rendered + ' uploaded.');
            }, function (resp) {
                console.log('Error uploading file: ' + resp);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + this.progressPercentage + '% ' + evt.config.data.file.name);
            });
    }
}

let UploadFile = {
    controller: UploadFileCtrl,
    template: require('./upload-file.html')
}

export default UploadFile;