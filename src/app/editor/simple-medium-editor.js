import MediumEditor from 'medium-editor';

export class SimpleEditorCtrl {
    constructor($timeout) {
        this.$timeout = $timeout;
    }
    $onInit() {
        let editorOptions = {
            disableReturn: true,
            disableExtraSpaces: true,
            placeholder: {
                text: this.placeholder,
                hideOnClick: false
            },
            paste: {
                forcePlainText: true
            },
            toolbar: {
                buttons: []
            }
        }
        this.$timeout(() => {
            let editorElem = document.getElementsByClassName('simple-medium-editor ' + this.name)[0];
            this.editor = new MediumEditor(editorElem, editorOptions);
            this.editor.subscribe('editableInput', () => {
                this.text = this.editor.getContent();
            })
        })
    }


}

let SimpleEditor = {
    controller: SimpleEditorCtrl,
    template: `
    <div class="simple-medium-editor" ng-class="$ctrl.name"></div>    
    `,
    bindings: {
        placeholder: '@',
        text: '=',
        name: '@'
    }
}

export default SimpleEditor;