import MediumEditor from 'medium-editor';
var $ = require('jquery');

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
        console.log("initializing simple ", this.name);
        this.$timeout(() => {
            let editorElem = $('.simple-medium-editor.' + this.name);
            this.editor = new MediumEditor(editorElem, editorOptions);
            this.editor.subscribe('editable', () => {
                this.text = this.editor.getContent();
                console.log("new text: ", this.text);
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