
export class UploadFileCtrl {
    constructor($log, Upload, $timeout) {
        this.Upload = Upload;
        this.$timeout = $timeout;
    }

    $onInit() {
        if(!this.uploadUrl)
            this.newImage = true;
    }

    upload(file, alt_text = "", caption = "") {
        let mediaUrl = window.location.origin + '/wp-json/wp/v2/media';
        this.newImage = true;
        let uploadOptions = {
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
        };

        this.Upload.upload(uploadOptions).then((resp) => {
                this.uploadUrl = resp.data.source_url;
                this.uploadId = resp.data.id;
                if (this.onUploaded)
                    this.onUploaded({ $uploadLink: this.uploadUrl, $fileId: this.uploadId });
            }, function (resp) {
                console.log('Error uploading file: ' + resp);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                if (this.progress)
                    this.progress({ $uploadPercent: this.progressPercentage });
            });
    }

}

let UploadFile = {
    controller: UploadFileCtrl,
    templateUrl: 'components/upload-file.html',
    transclude: true,
    bindings: {
        progress: '&',
        onUploaded: '&',
        uploadId: '=',
        uploadUrl: '=',
    }
}

export default UploadFile;