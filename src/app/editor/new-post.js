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
        this.state.featured_media = fileId;
    }

    progress(percent) {
        console.log("progress: ", percent);
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
                // ensure this.state is done loading
                this.chips.categories = [];
                //this.chips.categories = this.chips.allCategories.filter(c => this.state.categories.contains(c.id))
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
                //this.chips.tags = this.chips.allTags.filter(t => this.state.tags.contains(t.id));
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
        this.state = {
                title: {},
                excerpt: {},
                content: {},
                categories: [],
                tags: []
            }
        if(this.postId) {
            this.PostService.$restApi.posts().id(postId).get({embed: true}).then(
                post => {
                    angular.extend(this.state, post);
                    // fetch featured image;
                    // populate chips
                });
        } 
    }

    initBody() {
        // for full editor options see https://github.com/yabwe/medium-editor/blob/master/OPTIONS.md
        let contentEditorOptions = {
            buttonLabels: 'fontawesome',
            targetBlank: true,
            placeholder: {
                text: 'Write your story here',
                hideOnClick: false
            },
            extensions: {
                'auotlist':  new AutoList()
            },
            toolbar: {
                buttons: ['h1', 'h2', 'bold', 'italic', 'quote', 'pre', 'unorderedlist', 'orderedlist', 'justifyLeft', 'justifyCenter', 'anchor']
            }

        };

        let elem = $('.post-body');
        this.contentEditor = new MediumEditor(elem, contentEditorOptions);
        this.contentEditor.subscribe('editableInput', () => this.state.content.rendered = this.contentEditor.getContent())
            

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
        if(this.state.id !== null && this.state.id !== undefined) {
            // todo: bind categories and tags            
            this.state.categories = this.chips.categories.map(c => c.id);
            this.state.tags = this.chips.tags.map(t => t.id);
            this.PostService.$restApi.posts().id(this.state.id).post(this.state);
        }
        else {
            this.PostService.$restApi.posts().add(this.state).post().then(
                (post) => {
                    angular.extend(this.state, post);
                    this.postId = this.state.id;
                }
            )
        }
    }

    publish() {
        this.state.status = 'publish';
        this.save();
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