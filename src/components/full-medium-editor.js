import MediumEditor from 'medium-editor';
import AutoList from './autolist';

export class FullEditorCtrl {
    constructor($timeout) {
        this.$timeout = $timeout;
    }
    $onInit() {
        let editorOptions = {
            buttonLabels: 'fontawesome',
            targetBlank: true,
            placeholder: {
                text: 'Write your story here',
                hideOnClick: false
            },
            extensions: {
                'auotlist': new AutoList(),
            },
            autoLink: true,
            toolbar: { // image icon removed until fixed
                buttons: ['h3', 'h4', 'bold', 'italic', 'underline', 'strikethrough', 'quote', 'anchor',
                    'orderedlist', 'unorderedlist'],
                sticky: true,
                static: true,
                align: 'center',
                updateOnEmptySelection: true
            }

        };

        this.$timeout(() => {
            let editorElem = document.getElementsByClassName('full-medium-editor ' + this.name)[0];
            this.editor = new MediumEditor(editorElem, editorOptions);

            if(this.text)
                this.editor.setContent(this.text);
            
            this.editor.subscribe('editableInput', () => {
                // get content
                this.text = this.editor.getContent();
            })
        });
    }


}

let FullEditor = {
    controller: FullEditorCtrl,
    template: '<div class="full-medium-editor" ng-class="$ctrl.name" style="outline:none"></div>',
    bindings: {
        placeholder: '@',
        text: '=',
        name: '@'
    }
}

export default FullEditor;