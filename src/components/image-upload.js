import MediumEditor from 'medium-editor';

export class ImgUploadCtrl {
    constructor($timeout) {
        this.$timeout = $timeout;
    }
    // todo: add dragOver class
    // implement defer and multiple
    $onInit() {
        let editorOptions = {
            disableReturn: true,
            disableExtraSpaces: true,
            disableEditing: true,
            imageDragging: true,
            placeholder: false,
            paste: false,
            keyboardCommands: false,
            toolbar: {
                buttons: ['image'],
                static: true,
                align: 'center',
                updateOnEmptySelection: true, // keep it open always
            }
        }
        this.$timeout(() => {
            let editorElem = document.getElementsByClassName('img-upload-editor ' + this.name)[0];
            this.editor = new MediumEditor(editorElem, editorOptions);
            
            this.editor.subscribe('editableDrag', (event, editable) => {
                // enable editing 
                editable.setAttribute('contentEditable', true);

            });

            this.editor.subscribe('editableDrop', (event,editable) => {
                // if multiple images are not allowed, clear the dom element
                if(!this.multiple)
                    this.editor.setContent('');

                setTimeout(() => {
                    // grab the image src
                    let img = angular.element(editable).find('img');
                    // add image-response and image-center stuff
                    img.addClass('img-responsive img-thumbnail');
                    this.imgSrc = img[0].currentSrc;
                    editable.removeAttribute('contentEditable'); // prevent adding text content
                },100)
            })
        })
    }


}

let ImgUpload = {
    controller: ImgUploadCtrl,
    template: `<div ng-class="$ctrl.name + ' img-upload-editor'"><ng-transclude></ng-transclude></div>`,
    transclude: true,
    bindings: {
        name:       '@',    // useful for differentiating between multiple img-upload medium instances
        imgSrc:     '=',    // the url or encoded-binary of the image
        defer:      '=',    // when set to true, the image is not uploaded to the server and imgSrc is the encoded image
        multiple:   '=',    // when set to true, multiple images can be dropped, and imgSrc returns an array instead of a string
    }
}

export default ImgUpload;