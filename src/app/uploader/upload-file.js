
export class UploadFileCtrl {
    constructor($mdDialog, Upload) {
        this.Upload = Upload;
        this.$mdDialog = $mdDialog;        
    }

    upload(file, alt_text = "", caption = "") {
        console.log("upload file called");
            let mediaUrl = window.location.origin + '/wp-json/wp/v2/media'
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
                //this.scope.onUploaded({$uploadLink: this.fileUrl});
            }, function (resp) {
                console.log('Error uploading file: ' + resp);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + this.progressPercentage + '% ' + evt.config.data.file.name);
                //this.scope.progress({$uploadPercent: this.progressPercentage});
            });
    }
}



let UploadFile = {
    controller: UploadFileCtrl,
    template: require('./upload-file.html'),
    transclude: true
}

export default UploadFile;