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
                'auotlist': new AutoList()
            },
            autoLink: true,
            imageDragging: true,
            toolbar: {
                buttons: ['h3', 'h4', 'bold', 'italic', 'underline', 'strikethrough', 'quote', 'anchor', 'image',
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
            this.editor.subscribe('editableBlur', () => {
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