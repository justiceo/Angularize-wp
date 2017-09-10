import MediumEditor from 'medium-editor';
import AutoList from './autolist';
var $ = require('jquery');
$.fn.load = function(callback){ $(window).on("load", callback) };
var mediumInsert = require('medium-editor-insert-plugin')($);

export class FullEditorCtrl {
    constructor($timeout) {
        this.$timeout = $timeout;
        this.restrict = 'EA';
        this.transclude = true;
        this.scope= {
            placeholder: "@placeholder",
            text: "=text"
        };
    }

    link(scope, editorElem, attr) {
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
            let editor = new MediumEditor(editorElem, editorOptions);

            if(scope.text) {
                editor.setContent(scope.text);
            };

            // watch for update via code/ajax until user dirties value
            let unwatch = scope.$watch('text', function(text) {
                editor.setContent(text);
                return unwatch;
            })
            
            editor.subscribe('editableInput', () => {
                // get content
                unwatch();
                scope.text = editor.getContent();
            });

            $(function () {
                $(editorElem).mediumInsert({
                    editor: editor
                });
            });
        });
    }


}

let FullEditor = function($timeout) {
    return new FullEditorCtrl($timeout)
}

export default FullEditor;