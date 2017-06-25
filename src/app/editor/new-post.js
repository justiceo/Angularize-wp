import MediumEditor from 'medium-editor';
import AutoList from 'medium-editor-autolist';
var $ = require('jquery');
require('medium-editor-insert-plugin')($);

export class NewPostCtrl {
    constructor($scope, $mdDialog, $log, Cache, ToolbarService, PostService) {
        angular.extend(this, {
            '$scope': $scope, 'Cache': Cache, 'ToolbarService': ToolbarService,
            'PostService': PostService, '$mdDialog': $mdDialog, '$log': $log
        });

        $log.log("NewPost: Initializing...")
        this.categories = ["cat", "ego", "ry"];
        this.tags = ["#ta", "gs"];
        this.authorName = "Justice Ogbonna";
        this.state = {};
        this.lastModified = 0;
        this.PostService.ready().then(
            () => {
                this.initHeader();
                this.initBody();
                this.addToolbarButtons();   
            },
            (err) => {
                // show a toaster with the error
                console.log("error: ", err);
            }
        )     
    }

    initHeader() {
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
        let titleElem = $('.post-title');
        this.titleEditor = new MediumEditor(titleElem, titleEditorOptions);
        this.titleChanged = 0;

        let excerptElem = $('.post-excerpt');
        let excerptEditorOptions = titleEditorOptions;
        excerptEditorOptions.placeholder.text = "Write a short introduction";
        this.excerptEditor = new MediumEditor(excerptElem, excerptEditorOptions);
        this.excerptChanged = 0;
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
                buttons: ['h1', 'h2', 'bold', 'italic', 'quote', 'pre', 'unorderedlist', 'orderedlist', 'justifyLeft', 'justifyCenter', 'anchor']
            }

        };

        let elem = $('.post-body');
        this.contentEditor = new MediumEditor(elem, contentEditorOptions);
        this.contentChanged = 0;

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
        var confirm = this.$mdDialog.confirm()
            .title('Irreparable Damage Ahead')
            .textContent('Are you positively absolutely certain you want to discard all changes?')
            .ariaLabel('Confirm discard')
            .ok('Please do it!')
            .cancel('No, I changed my mind');
        this.$mdDialog.show(confirm).then(
            () => { // user agreed
                console.log("content: ", this.titleEditor.getContent(), this.titleEditor.serialize())
                this.titleEditor.resetContent();
                this.excerptEditor.resetContent();
                this.contentEditor.resetContent();
            }, () => { // user changed their mind
                // do nothing
            });
        // todo: later: if there are no changes to discard, replace with delete button
    }

    save() {
        let data = {
            title: this.titleEditor.getContent(),
            excerpt: this.excerptEditor.getContent(),
            content: this.contentEditor.getContent()
        }
        if(this.postId) { // we're editing. **bug: 0 is valid post-id but falsy 
            this.PostService.$restApi.posts().id(this.postId).post(data);
        }
        else {
            this.PostService.$restApi.posts().add(data).post().then(
                (post) => {
                    this.postId = post.attr('id');
                }
            )
        }
    }
}

let NewPost = {
    controller: NewPostCtrl,
    template: require('./edit-post.html')
}

export default NewPost;