import MediumEditor from 'medium-editor';
import AutoList from 'medium-editor-autolist';
var $ = require('jquery');
require('medium-editor-insert-plugin')($);

export class AbstractEditorCtrl {
    constructor(PostService) {
        this.restrict = 'A';
        this.transclude = true;
        this.scope = {};
        this.PostService = PostService;
        this.template = function(elem, attrs) {
            var tag = elem[0].nodeName;
            return "<"+tag+" data-ng-transclude ng-*=''></"+tag+">";
        }

    }

    compile(elem, attr) {

        // takes placeholder as input
        // add the edit button with handler here here
        elem.css("background", "#ddd");

        let autolist = new AutoList();
        // for full editor options see https://github.com/yabwe/medium-editor/blob/master/OPTIONS.md
        let contentEditorOptions = {
			buttonLabels: 'fontawesome',
            placeholder: {
				text: 'Write your story here',
				hideOnClick: false
			},
            extensions: {
                'auotlist': autolist
            },
			toolbar: {
				buttons: ['h1', 'h2', 'bold', 'italic', 'quote', 'pre', 'unorderedlist','orderedlist', 'justifyLeft', 'justifyCenter', 'anchor']
			}

		};

        this.contentEditor = new MediumEditor(elem, contentEditorOptions);
        this.contentEditor.destroy(); // fix this later
        $(function () {
            $(elem).mediumInsert({
                editor: this.contentEditor
            });
        });

        // todo: add edit button above element
        // todo: add edit handler
        // todo: add save and cancel handlers
        return this.link;
    }

    link(scope, elem, attr) {
        elem.bind("click", () => {
            this.contentEditor.setup();
        })
        elem.bind("doubleclick", () => {
            this.contentEditor.destroy();
        })
    }
}

let EditorDirective = function(PostService) {
    return new AbstractEditorCtrl(PostService);
}

// todo: separate functions for edit-title, edit-content, edit-featured image

export default EditorDirective;