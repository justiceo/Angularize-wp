
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

        this.loadPostSettings();
        var settingsButton = {
            id: 'le_settings',
            title: 'Settings',
            icon: 'icon-settings',
            position: 4,
            handler: () => this.settingsHandler()
        };
        ToolbarService.add(settingsButton);
        $scope.cancel =  () => $mdDialog.hide();     
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