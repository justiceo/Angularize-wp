
export class UploadFileCtrl {
    constructor(Upload) {
        this.Upload = Upload;
    }

    upload(file, alt_text = "", caption = "") {
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
                this.uploadUrl = resp.data.source_url;
                this.uploadId = resp.data.id;
                if(this.onUploaded)
                    this.onUploaded({ $uploadLink: this.uploadUrl, $fileId: this.uploadId });
            }, function (resp) {
                console.log('Error uploading file: ' + resp);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                if(this.progress)
                    this.progress({ $uploadPercent: this.progressPercentage });
            });
    }
}

let UploadFile = {
    controller: UploadFileCtrl,
    template: require('./upload-file.html'),
    transclude: true,
    bindings: {
        progress: '&',
        onUploaded: '&',
        uploadId: '=',
        uploadUrl: '='
    }
}

export default UploadFile;