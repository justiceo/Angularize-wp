import MediumEditor from 'medium-editor';
import AutoList from 'medium-editor-autolist';

export class NewPostCtrl {
    constructor($scope, $log, Upload, Cache, ToolbarService, PostService, ALL_CITIES) {
        angular.extend(this, {
            '$scope': $scope, 'Upload': Upload, 'Cache': Cache, 'ToolbarService': ToolbarService,
            'PostService': PostService, '$log': $log, 'ALL_CITIES': ALL_CITIES
        });
    }

    $onInit() {
        //todo: show a progressbar or loading icon while we setup and fetch data

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

        this.$log.log("NewPost: Initializing...");
        this.PostService.ready().then(
            () => {
                this.initState();
                this.initBody();
                this.addToolbarButtons();
            },
            (err) => {
                // show a toaster with the error
                console.log("error: ", err);
            }
        )
    }

    progress(percent) {
        console.log("progress: ", percent);
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
            categories: [],
            tags: []
        };
        this.chips = {
            categories: [],
            tags: [],
            allCategories: [],
            allTags: []
        }; // holds data for md-chips
        if (this.postId) {
            this.PostService.$restApi.posts().id(postId).get({ embed: true }).then(
                post => {
                    angular.extend(this.state, post.rawVal());
                    this.featuredImage = this.state._embedded['wp:featuredmedia'][0].link;
                    this.authorName = this.state._embedded.author.name;
                    this.chips.categories = this.state._embedded['wp:term'].filter(t => t.taxonomy === 'category');
                    this.chips.tags = this.state._embedded['wp:term'].filter(t => t.taxonomy === 'post_tags');
                });
        }

        this.PostService.$restApi.categories().get().then((c) => {
            this.chips.allCategories = c.rawVal().map(c => {
                return { id: c.id, name: c.name }
            });
            this.list = c.rawVal().map(c => c.slug);
        });
        this.PostService.$restApi.tags().get().then(t => this.chips.allTags = t.rawVal());
    }

    initBody() {
        // for full editor options see https://github.com/yabwe/medium-editor/blob/master/OPTIONS.md

        // todo: inline AutoList please
        let contentEditorOptions = {
            buttonLabels: 'fontawesome',
            targetBlank: true,
            placeholder: {
                text: 'Write your story here',
                hideOnClick: false
            },
            extensions: {
                'auotlist': new AutoList()
            },
            autoLink: true,
            imageDragging: true,
            toolbar: {
                buttons: ['h2', 'h3', 'bold', 'italic', 'underline', 'strikethrough', 'quote', 'anchor', 'image', 'justifyLeft', 'justifyCenter', 'justifyRight',
                    'justifyFull', 'orderedlist', 'unorderedlist', 'outdent', 'indent',],
                sticky: true,
                static: true,
                align: 'center',
                updateOnEmptySelection: true
            }

        };

        this.contentEditor = new MediumEditor('.post-body', contentEditorOptions);
        this.contentEditor.subscribe('editableInput', () => this.state.content = this.contentEditor.getContent())

    }

    addToolbarButtons() {

        let deleteButton = {
            id: 'angularize_editor_delete',
            title: 'Discard',
            icon: 'fa fa-2x fa-trash-o',
            position: 1,
            handler: () => this.discard()
        };
        let cancelButton = {
            id: 'angularize_editor_cancel',
            title: 'Discard',
            icon: 'fa fa-2x fa-times',
            position: 1,
            handler: () => this.discard()
        };
        let saveButton = {
            id: 'angularize_editor_save',
            title: 'Save Changes',
            icon: 'fa fa-2x fa-floppy-o',
            position: 2,
            handler: () => this.save()
        };
        let publishButton = {
            id: 'angularize_editor_publish',
            title: 'Save & Publish',
            icon: 'fa fa-2x fa-thumbs-o-up',
            position: 3,
            handler: () => this.publish()
        };
        // todo: add a ToolbarService.create("id", "title", "icon", 1) function
        this.ToolbarService.add(cancelButton);
        this.ToolbarService.add(deleteButton);
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
        if (this.state.id !== null && this.state.id !== undefined) {
            // todo: bind categories and tags 
            // todo: extract and upload all embed resources           
            this.state.categories = this.chips.categories.map(c => c.id);
            this.state.tags = this.chips.tags.map(t => t.id);
            this.PostService.$restApi.posts().id(this.state.id).post(this.state);
        }
        else {
            this.PostService.$restApi.posts().add(this.state).post().then(
                (post) => {
                    angular.extend(this.state, post.rawVal());
                    angular.extend(this.state, { title: this.state.title.rendered, excerpt: this.state.excerpt.rendered, content: this.state.content.rendered })
                    console.log("after save state: ", this.state)
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