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
                // get content and strip any html tags
                this.text = this.editor.getContent().replace(/<(?:.|\n)*?>/gm, '');
            })
        })
    }


}

let SimpleEditor = {
    controller: SimpleEditorCtrl,
    template: '<div class="simple-medium-editor" ng-class="$ctrl.name" style="outline:none"></div>',
    bindings: {
        placeholder: '@',
        text: '=',
        name: '@'
    }
}

export default SimpleEditor;