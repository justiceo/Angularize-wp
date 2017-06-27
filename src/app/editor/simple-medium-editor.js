import MediumEditor from 'medium-editor';
var $ = require('jquery');

export class SimpleEditorCtrl {
    constructor() {
    }
    $postLink() {
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
            console.log("new text: ", this.text);
        })
    }
    

}

let SimpleEditor = {
    controller: SimpleEditorCtrl,
    template: `
    <div class="simple-medium-editor" style="outline:none; padding: 10px 0px; max-width:300px"></div>    
    `,
    bindings: {
        placeholder: '@',
        text: '='
    }
}

export default SimpleEditor;