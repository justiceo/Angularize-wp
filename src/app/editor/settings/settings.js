
export class PostSettingsCtrl {
    constructor($scope, $mdDialog, $mdToast, PostService, ToolbarService) {
        console.log("PostSettingsCtrl: postservice", PostService);
        this.$mdDialog = $mdDialog;
        this.$mdToast = $mdToast;
        this.PostService = PostService;
        this.ToolbarService = ToolbarService;
        this.$scope = $scope;
        this.$scope.categories = [];
        this.$scope.tags = [];

        //this.loadPostSettings();
        var settingsButton = {
            id: 'le_settings',
            title: 'Settings',
            icon: 'icon-settings',
            position: 4,
            handler: () => this.settingsHandler()
        };
        ToolbarService.add(settingsButton);
        $scope.cancel = () => $mdDialog.hide();
        this.$scope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        this.post = new wp.api.models.Post({ id: PostService.the_post().ID });
        this.post.fetch();
        console.log("post: ", this.post);
        let postCats = this.post.getCategories();
        console.log("first cat: ", postCats);
        this.post.getCategories().done(
            cats => {
                console.log("cats: ", cats);
                this.$scope.categories = cats;
                this.$scope.safeApply();
            }
        );
        this.post.getTags().done(
            tags => {
                console.log("tags: ", tags);
                this.$scope.tags = tags;
                this.$scope.safeApply();
            }
        );
    }

    settingsHandler() {
        this.$mdDialog.show({
            template: '<post-settings>',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            openFrom: '#le_toolbar', // use elem
            closeTo: '#le_toolbar',
            fullscreen: true // Only for -xs, -sm breakpoints.
        });
    }

    loadPostSettings() {
        this.PostService.get_categories().then(
            cats => {
                this.$scope.categories = cats;
            }
        );
        this.PostService.get_tags().then(
            tags => {
                this.$scope.tags = tags;
            }
        )
    }

    savePostSettings() {
        console.log("Save post settings clicked");
        PostService.updatePost({
            'categories': this.$scope.categories,
            'tags': this.$scope.tags
        }).then(
            success => {
                this.notify("Updated post settings");
            }
            )
    }

    cancel() {
        console.log("cancel clicked");
    }

    notify(notice) {
        this.$mdToast.show(
            this.$mdToast.simple()
                .textContent(notice)
                .position('top right')
                .hideDelay(1500)
        )
    }
}

let PostSettings = {
    controller: PostSettingsCtrl,
    template: require('./settings.html')
};

export default PostSettings;