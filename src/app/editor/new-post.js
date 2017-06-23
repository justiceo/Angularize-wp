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
        let button = {
            id: 'le_new_post',
            title: 'New Post',
            icon: 'icon-pencil',
            position: 2,
            handler: () => this.newPostHandler()
        };
        ToolbarService.add(button);


        $scope.cancel =  () => $mdDialog.hide();        

        $scope.create = function (title) {
            console.log("EDITOR: creating post title");
            if (!title) return;
        }
        $scope.categories = [];
        $scope.tags = [];
        $scope.authorName = "Justice Ogbonna";
        this.initHeader();
        this.initBody();
    }

    newPostHandler() {
        this.$mdDialog.show({
            template: require('./new-post.html'),
            scope: this.$scope,
            preserveScope: true,
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            openFrom: '#le_toolbar',
            closeTo: '#le_toolbar',
            fullscreen: true // Only for -xs, -sm breakpoints.
        });
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
        let excerptEditorOptions = {
            disableReturn: true,
            disableExtraSpaces: true,
            placeholder: {
                text: 'A little more about your story please',
                hideOnClick: false
            },
            paste: {
                forcePlainText: true
            },
            toolbar: {
                buttons: []
            }
        }
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


}

let NewPost = {
    controller: NewPostCtrl,
    template: require('./edit-post.html')
}

export default NewPost;