import MediumEditor from 'medium-editor';

export class ImgUploadCtrl {
    constructor($timeout) {
        this.$timeout = $timeout;
    }
    
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
                editable.setAttribute('contentEditable', true)
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
    template: '<div class="img-upload-editor" ng-class="$ctrl.name" style="outline:none; min-height: 250px; background: #eee; text-align: center"></div>',
    bindings: {
        name: '@',
        imgSrc: '=',
        multiple: '='
    }
}

export default ImgUpload;