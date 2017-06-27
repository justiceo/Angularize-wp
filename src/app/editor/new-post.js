import MediumEditor from 'medium-editor';
import AutoList from 'medium-editor-autolist';
var $ = require('jquery');
require('medium-editor-insert-plugin')($);

export class NewPostCtrl {
    constructor($scope, $mdDialog, $log, Upload, Cache, ToolbarService, PostService) {
        angular.extend(this, {
            '$scope': $scope, 'Upload': Upload, 'Cache': Cache, 'ToolbarService': ToolbarService,
            'PostService': PostService, '$mdDialog': $mdDialog, '$log': $log
        });

        $log.log("NewPost: Initializing...");
        this.authorName = "Justice Ogbonna";
        this.chips = {}; // holds data for md-chips
        this.featuredImage = 'https://www.kidscodecs.com/wp-content/uploads/2013/07/oskay-hello-world-toast1.jpg';
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

    openFeaturedImage() {
        this.$mdDialog.show({
            template: '<upload-file>',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            openFrom: '#le_toolbar', // use elem
            closeTo: '#le_toolbar',
            fullscreen: true // Only for -xs, -sm breakpoints.
        });
    }

    onFileSelect(files) {
        console.log("files: ", files);
    }

    uploadFile(file) {
        console.log("upload file: ", file);
        this.Upload.upload({
            url: 'wp-json/wp/v2/media/',
            data: {file: file, 'username': 'justice'}
        }).then(function (resp) {
            console.log('Success ', resp.config.data.file.name, ' uploaded. Response: ', resp.data);
        }, function (resp) {
            console.log('Error status: ', resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ', progressPercentage, '% ', evt.config.data.file.name);
        });
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
        //this.titleEditor = new MediumEditor(titleElem, titleEditorOptions);
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
        let publishButton = {
            id: 'angularize_editor_publish',
            title: 'Save & Publish',
            icon: 'check',
            position: 3,
            handler: () => this.publish()
        };
        this.ToolbarService.add(cancelButton);
        this.ToolbarService.add(saveButton);
        // todo: only add if post is not published
        this.ToolbarService.add(publishButton);
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

    publish() {
        let data = {
            title: this.titleEditor.getContent(),
            excerpt: this.excerptEditor.getContent(),
            content: this.contentEditor.getContent(),
            categories: this.chips.categories.map(c => c.id),
            tags: this.chips.tags.map(t => t.id),
            status: 'publish'
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

// todo: add postId binding to component
// - if postId is specified, load post and prepopulate title, excerpt, content, cats..etc
// 