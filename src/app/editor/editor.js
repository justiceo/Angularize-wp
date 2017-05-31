import MediumEditor from 'medium-editor';

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

        this.contentEditorOptions = {
			buttonLabels: 'fontawesome',
			placeholder: {
				text: 'Write your story here',
				hideOnClick: false
			},
			toolbar: {
				buttons: ['h1', 'h2', 'bold', 'italic', 'quote', 'pre', 'unorderedlist','orderedlist', 'justifyLeft', 'justifyCenter', 'anchor']
			}

		};
		//this.contentEditor = new MediumEditor(".editable",contentEditorOptions);
    }

    compile(elem, attr) {
        // add the edit button with handler here here
        elem.css("background", "#ddd");
        this.contentEditor = new MediumEditor(elem,this.contentEditorOptions);
        this.contentEditor.setup();
        return this.link;
    }

    link(scope, elem, attr) {

    }
}

let EditorDirective = function(PostService) {
    return new AbstractEditorCtrl(PostService);
}

// separate functions for edit-title, edit-content, edit-featured image

export default EditorDirective;