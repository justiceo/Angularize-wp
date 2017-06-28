
export class UploadFileCtrl {
    constructor($mdDialog, Upload) {
        this.Upload = Upload;
        this.$mdDialog = $mdDialog;

        this.restrict = 'E';
        this.scope = {};
        this.transclude = true;
        this.template = require('./upload-file.html');
    }

    compile(elem, attr) {
        return this.link
    }

    link(scope, elem, attr) {
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

let UploadFileDirective = function($mdDialog, Upload) {
    return new UploadFileCtrl($mdDialog, Upload);
}

export default UploadFileDirective;