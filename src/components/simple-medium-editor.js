import MediumEditor from 'medium-editor';

export class SimpleEditorCtrl {
    constructor($timeout) {
        this.$timeout = $timeout;
        this.restrict = 'EA';
        this.transclude = true;
        this.scope= {
            placeholder: "@placeholder",
            text: "=text"
        };
        /*
        this.templated = function( element, attrs ) {
            // for transparent tempplate
            var tag = element[0].nodeName;
            return '<' +tag+ ' style="outline:none" data-ng-transclude ng-*=""></'+tag+'>';

            // for new template
            return '<div class="simple-medium-editor" ng-class="$ctrl.name" style="outline:none"></div>';
        };*/
    }

    link(scope, editorElem, attr) {
        console.log("link called...", scope.placeholder);
        let editorOptions = {
            disableReturn: true,
            disableExtraSpaces: true,
            imageDragging: false,
            placeholder: {
                text: scope.placeholder || '',
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
            console.log("initing editor")
            this.editor = new MediumEditor(editorElem, editorOptions);

            if(scope.text) {
                this.editor.setContent(scope.text);
            };

            this.editor.subscribe('editableInput', () => {
                // get content and strip any html tags
                scope.text = this.editor.getContent().replace(/<(?:.|\n)*?>/gm, '');
            })
        });
    }
}

let SimpleEditor = function($timeout) {
  return new SimpleEditorCtrl($timeout);
}

export default SimpleEditor;