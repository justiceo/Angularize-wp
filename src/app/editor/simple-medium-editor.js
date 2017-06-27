import MediumEditor from 'medium-editor';
var $ = require('jquery');

export class SimpleEditorCtrl {
    constructor() {
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
        let editorElem = $('.simple-medium-editor');
        this.editor = new MediumEditor(editorElem, editorOptions);
        this.editor.subscribe('editable', ()=>{
            this.text = this.editor.getContent();
        })
    }

}

let SimpleEditor = {
    component: SimpleEditorCtrl,
    template: '<span class="simple-medium-editor"></span>',
    bindings: {
        placeholder: '<',
        text: '='
    }
}

export default SimpleEditor;