import MediumEditor from 'medium-editor';
import AutoList from 'medium-editor-autolist';
var $ = require('jquery');
require('medium-editor-insert-plugin')($);

export class NewPostCtrl {
    constructor($scope, $mdDialog, $log, Upload, Cache, ToolbarService, PostService, ALL_CITIES) {
        angular.extend(this, {
            '$scope': $scope, 'Upload': Upload, 'Cache': Cache, 'ToolbarService': ToolbarService,
            'PostService': PostService, '$mdDialog': $mdDialog, '$log': $log, 'ALL_CITIES': ALL_CITIES
        });

        this.ALL_CITIES = [
            {
                name: "Lagos",
                country: "NG",
                lat: 12345,
                lon: 54332
            },
            {
                name: "Philadelphia",
                country: "US",
                lat: 342342,
                lon: 74534
            }
        ];
        this.ALL_CITIES = ["Lagos", "Abuja", "london", "austy"];

        $log.log("NewPost: Initializing...");
        this.chips = {}; // holds data for md-chips
        this.PostService.ready().then(
            () => {             
                this.authorName = this.postId ? this.state.attr('author') : this.PostService.$wp.currentUser.data.display_name; // get from post cause it might be editor
                this.loadMeta();
                this.initBody();
                this.addToolbarButtons();
            },
            (err) => {
                // show a toaster with the error
                console.log("error: ", err);
            }
        )
    }

    setFeaturedImage(url, fileId){
        this.featuredImage = url;
        this.featuredImageId = fileId;
    }

    progress(percent) {
        console.log("progress: ", percent);
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

    citySearch(query) {
        return query ? this.ALL_CITIES.filter(city => {
            return city.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
        }) : [];
    }

    /**
     * Create filter function for a query string
     */
    createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(taxonomy) {
            return (taxonomy.name.indexOf(lowercaseQuery) !== -1) ||
                (taxonomy.slug.indexOf(lowercaseQuery) !== -1);
        };

    }

    initState() {
        if(this.postId) {
            this.state = this.PostService.$restApi.posts().id(postId);
            this.state.get({embed: true});
        }
        else {
            this.state = {}
        }   
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
            icon: 'cursor',
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
            title: this.postTitle,
            excerpt: this.postExcerpt,
            content: this.contentEditor.getContent(),
            categories: this.chips.categories.map(c => c.id),
            tags: this.chips.tags.map(t => t.id),
            featured_media: this.featuredImageId
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
            title: this.postTitle,
            excerpt: this.postExcerpt,
            content: this.contentEditor.getContent(),
            categories: this.chips.categories.map(c => c.id),
            tags: this.chips.tags.map(t => t.id),
            featured_media: this.featuredImageId,
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
    template: require('./new-post.html'),
    bindings: {
        postId: '@'
    }
}

export default NewPost;

// todo: add postId binding to component
// - if postId is specified, load post and prepopulate title, excerpt, content, cats..etc
// 