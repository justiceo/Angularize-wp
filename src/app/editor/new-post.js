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
        this.categories = [];
        this.tags = [{
            type: 2,
            name: "hello"
        }];
        this.authorName = "Justice Ogbonna";
        this.state = {};
        this.lastModified = 0;
        this.meta = {};     // holds all categories, tags, statuses, user info
        this.chips = {}; // holds data for md-chips
        this.PostService.ready().then(
            () => {
                //this.fetchPost();
                this.loadMeta();
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

    // get author info, post categories, post tags, post status
    loadMeta() {
        let categories = this.PostService.$restApi.categories();
        categories.get().then(
            () => {
                this.chips.allCategories = categories.rawVal().map(c => {
                    return {
                        'id': c.id,
                        'name': c.name,
                        'slug': c.slug
                    }
                });
                this.chips.categories = [];
            }
        )

        let tags = this.PostService.$restApi.tags();
        tags.get().then(
            () => {
                this.chips.allTags = tags.rawVal().map(t => {
                    return {
                        'id': t.id,
                        'name': t.name,
                        'slug': t.slug
                    }
                });
                this.chips.tags = [];
            }
        )
    }

    categorySearch(query) {
        return query ? this.chips.allCategories.filter(this.createFilterFor(query)) : [];;
    }

    tagSearch(query) {
        return query ? this.chips.allTags.filter(this.createFilterFor(query)) : [];
    }

    /**
     * Create filter function for a query string
     */
    createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(taxonomy) {
            return (taxonomy.name.indexOf(lowercaseQuery) === 0) ||
                (taxonomy.slug.indexOf(lowercaseQuery) === 0);
        };

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
            icon: 'action-undo',
            position: 1,
            handler: () => this.discard()
        };
        let saveButton = {
            id: 'angularize_editor_save',
            title: 'Save Changes',
            icon: 'check',
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
            content: this.contentEditor.getContent(),
            categories: this.chips.categories.map(c => c.id),
            tags: this.chips.tags.map(t => t.id)
        }
        if (this.postId) { // we're editing. **bug: 0 is valid post-id but falsy 
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

    transformChip(chip) {
      // If it is an object, it's already a known chip
      if (angular.isObject(chip)) {
        return chip;
      }

      // Otherwise, create a new one
      // todo: ensure new chips have ids upon save
      return { name: chip, slug: chip.toLowerCase() }
    }
}

let NewPost = {
    controller: NewPostCtrl,
    template: require('./edit-post.html')
}

export default NewPost;