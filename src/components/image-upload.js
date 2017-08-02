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
                sticky: true,
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
                setTimeout(() => {
                    editable.removeAttribute('contentEditable')
                },100)
            })
        })
    }


}

let ImgUpload = {
    controller: ImgUploadCtrl,
    template: '<div class="img-upload-editor" ng-class="$ctrl.name" style="outline:none; min-height: 250px; background: red"></div>',
    bindings: {
        placeholder: '@',
        text: '=',
        name: '@'
    }
}

export default ImgUpload;