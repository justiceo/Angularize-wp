import MediumEditor from 'medium-editor';

export class NewPostCtrl {
    constructor($scope, Upload, ToolbarService, RestApi, toaster, $uibModal) {
        angular.extend(this, {
            '$scope': $scope, 'Upload': Upload, 'ToolbarService': ToolbarService,
            'RestApi': RestApi, 'toaster': toaster, '$uibModal' : $uibModal
        });
         toaster.pop('success', "title", "text");
    }

    $onInit() {
        this.RestApi.ready('/angularize/v1').then(
            $angularize_v1 => {
                let citiesWpObj = $angularize_v1.files().id('cities.json').get().then(
                    cities => {
                        
                        this.cities = cities.state.map(s => {
                            s = s.split(':');
                            return { name: s[0], country: s[1], lat: s[2], lon: s[3] }
                        });
                        this.city_names = this.cities.map(s => s.name + ', ' + s.country);
                        if(!this.state.meta.angularize_location && navigator.geolocation) {
                            // guess user location
                            navigator.geolocation.getCurrentPosition((position) => {

                                // Get the coordinates of the current position.
                                let lat = position.coords.latitude;
                                let lon = position.coords.longitude;
                                
                                let closest = 10000; 
                                let guessedCity = "";                              
                                for(let i=0; i < this.cities.length; i++) {
                                    let c = this.cities[i];
                                    let distance = Math.abs(c.lat-lat) + Math.abs(c.lon-lon);
                                    if(distance < closest) {
                                        closest = distance;
                                        guessedCity = c.name + ', ' + c.country;
                                    }                                        
                                }
                                if(!this.state.meta.angularize_location) {
                                    this.state.meta.angularize_location = guessedCity;
                                    this.$scope.$apply();
                                    console.log("loc: ", this.state.meta.angularize_location)
                                }
                            });
                        }
                    }
                );

                

            }
        );

        if(!this.postId) { // check if post id was passed in URL
            let url = new URL(window.location.href);
            let id = url.searchParams.get("id");
            if(id) this.postId = id;
        }
        
        this.RestApi.ready().then(
            () => {
                this.initState();
                this.addToolbarButtons();
            },
            (err) => {
                // show a toaster with the error
                console.log("error: ", err);
            }
        )
    }

    $onDestroy() {
        // todo: remove the registered buttons and any watchers
        // important as it might be launched via modal
        console.log("new post destroy called")
        this.removeToolbarButtons();
    }

    categorySearch(query) {
        return query ? this.chips.allCategories.filter(this.createFilterFor(query)) : [];;
    }

    tagSearch(query) {
        return query ? this.chips.allTags.filter(this.createFilterFor(query)) : [];
    }

    citySearch(query) {
        return query ? this.city_names.filter(city => {
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
            title: '', // holder for watchers
            excerpt: '', 
            content: '',
            status: 'draft',
            categories: [],
            tags: [],
            meta: {}
        };
        this.chips = {
            categories: [],
            tags: [],
            allCategories: [],
            allTags: []
        }; // holds data for md-chips
        if (this.postId) {
            this.RestApi.$wp_v2.posts().id(this.postId).get({ _embed: true }).then(
                post => {
                    angular.extend(this.state, post.state);
                    angular.extend(this.state, { title: this.state.title.rendered, excerpt: this.state.excerpt.rendered, content: this.state.content.rendered })
                    if(this.state._embedded['wp:featuredmedia']) // confirm there is actually a featured image present
                        this.featuredImage = this.state._embedded['wp:featuredmedia'][0].source_url;

                    this.authorName = this.state._embedded["author"][0].name;
                    
                    if(this.state._embedded['wp:term']) {
                        this.chips.categories = this.state._embedded['wp:term'].filter(t => t.taxonomy === 'category');
                        this.chips.tags = this.state._embedded['wp:term'].filter(t => t.taxonomy === 'post_tags');
                    }
                });
        }

        this.RestApi.$wp_v2.categories().get().then((c) => this.chips.allCategories = c.state());
        this.RestApi.$wp_v2.tags().get().then(t => this.chips.allTags = t.state());
    }

    addToolbarButtons() {
        let saveButton = {
            id: 'angularize_editor_save',
            title: 'Save',
            icon: 'fa fa-2x fa-floppy-o',
            position: 2,
            is_logged_in: true,
            handler: () => this.save()
        };

        // todo: add a ToolbarService.create("id", "title", "icon", 1) function
        this.ToolbarService.add(saveButton);              
    }

    removeToolbarButtons() {
        this.ToolbarService.removeById('angularize_editor_save');
    }

    save() {  
        // todo: extract and upload all embed resources 
        if (this.state.id !== null && this.state.id !== undefined) {
            this.RestApi.$wp_v2.posts().id(this.state.id).post(this.state);
        }
        else {
            this.RestApi.$wp_v2.posts().add(this.state).post().then(
                (post) => {
                    angular.extend(this.state, post.state);
                    angular.extend(this.state, { title: this.state.title.rendered, excerpt: this.state.excerpt.rendered, content: this.state.content.rendered })
                    this.postId = this.state.id;
                    // todo: show toast success message "Post have been saved"
					this.toaster.pop({
                        type: 'success',
                        title: 'Post updated!',
                    });
                },
                (error) => {
                    console.error(error);
                    // todo: show toast error "Error saving post"
					this.toaster.pop({
                        type: 'error',
                        title: 'Error saving post'
                    });
                }
            )
        }
    }
}

let NewPost = {
    controller: NewPostCtrl,
    templateUrl: 'components/new-post.html',
    bindings: {
        postId: '@',
        test: '='
    }
}

export default NewPost;