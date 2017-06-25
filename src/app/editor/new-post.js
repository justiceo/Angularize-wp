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
        this.initHeader();
        this.initBody();
        this.addToolbarButtons();
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

    anyModified() {
        let somethingChanged = (event, elem) => {
            console.log("something changed: ", event, elem);
            if (event.timeStamp > this.lastModified)
                this.lastModified = event.timeStamp;
        }
        let registerListeners = () => {
            this.titleEditor.subscribe('editableInput', somethingChanged);
            this.exerptEditor.subscribe('editableInput', somethingChanged);
            this.contentEditor.subscribe('editableInput', somethingChanged);
        }
        let unregisterListeners = () => {
            this.titleEditor.unsubscribe('editableInput', somethingChanged);
            this.exerptEditor.unsubscribe('editableInput', somethingChanged);
            this.contentEditor.unsubscribe('editableInput', somethingChanged);
        }
        let checkForChanges = () => {
            this.titleEditor.checkContentChanged();
            this.excerptEditor.checkContentChanged();
            this.contentEditor.checkContentChanged();
        }

        registerListeners();
        checkForChanges();
        unregisterListeners();

        let anyModified = this.lastModified > this.Cache.get('post_last_modified');
        this.Cache.set('post_last_modified', this.lastModified);
        return anyModified;
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
                this.titleEditor.resetContent();
                this.excerptEditor.resetContent();
                this.contentEditor.resetContent();
            }, () => { // user changed their mind
                // do nothing
            });
        // todo: later: if there are no changes to discard, replace with delete button
    }

    save() {
        console.log("post save called");
        // grab all the editors and extract their contents
    }
}

let NewPost = {
    controller: NewPostCtrl,
    template: require('./edit-post.html')
}

export default NewPost;