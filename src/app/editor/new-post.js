import MediumEditor from 'medium-editor';
import AutoList from 'medium-editor-autolist';
var $ = require('jquery');
require('medium-editor-insert-plugin')($);

export class NewPostCtrl {
    constructor($scope, $mdDialog, $log, ToolbarService, PostService) {
        angular.extend(this, {
            '$scope': $scope, 'ToolbarService': ToolbarService,
            'PostService': PostService, '$mdDialog': $mdDialog, '$log': $log
        });

        $log.log("NewPost: Initializing...") 
        this.categories = ["cat", "ego", "ry"];
        this.tags = ["#ta", "gs"];
        this.authorName = "Justice Ogbonna";
        this.initHeader();
        this.initBody();
        this.addToolbarButtons();
    }

    initHeader() {
        let titleElem = $('.post-title');
        let titleEditorOptions = {
            disableReturn: true,
            disableExtraSpaces: true,
            placeholder: {
                text: 'Name your story',
                hideOnClick: false
            },
            paste: {
                forcePlainText: true
            },
            toolbar: {
                buttons: []
            }
        }
        this.titleEditor = new MediumEditor(titleElem, titleEditorOptions);

        let excerptElem = $('.post-excerpt');
        let excerptEditorOptions = titleEditorOptions;
        excerptEditorOptions.placeholder.text = "Write a short introduction";
        this.exerptEditor = new MediumEditor(excerptElem, excerptEditorOptions);
    }

    initBody() {
        let autolist = new AutoList();
        // for full editor options see https://github.com/yabwe/medium-editor/blob/master/OPTIONS.md
        let contentEditorOptions = {
			buttonLabels: 'fontawesome',
            targetBlank: true,
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

        let elem = $('.post-body');
        this.contentEditor = new MediumEditor(elem, contentEditorOptions);
        //this.contentEditor.destroy(); // fix this later
        /*$(function () {
            elem.mediumInsert({
                editor: this.contentEditor
            });
        });*/

        // todo: add save and cancel handlers
    }

    addToolbarButtons() {
        let cancelButton = {
            id: 'angularize_editor_cancel',
            title: 'Discard',
            icon: 'home',
            position: 1,
            handler: () => this.discard()
        };
        let saveButton = {
            id: 'angularize_editor_save',
            title: 'Save Changes',
            icon: 'leaf',
            position: 2,
            handler: () => this.save()
        };
        this.ToolbarService.add(cancelButton);
        this.ToolbarService.add(saveButton);
    }

    /**
     * No changes are post to the server, but do we restore previous changes?
     * Is this like a delete function?
     * Will do both, if there are changes then discard otherwise delete
     */
    discard() {
        console.log("post discard called");
        // show "Are you sure you want to discard your changes?"
        // if there are no changes to discard, replace with delete button
    }

    save() {
        console.log("post save called");
        // grab all the editors and extract their contents
        let post = {};
        post.title = this.titleElem.text()
        post.content = "content here"; 
        post.excert = this.exerptElem.text();
        post.id = this.postId; // bound
        post.categories = this.categories;
        post.tags = this.tags;

    }
}

let NewPost = {
    controller: NewPostCtrl,
    template: require('./edit-post.html')
}

export default NewPost;