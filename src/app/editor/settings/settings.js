
export class PostSettingsCtrl {
    constructor($scope, PostService) {
        console.log("PostSettingsCtrl: postservice", PostService);
        this.$scope = $scope;
        this.$scope.categories = [];
        this.$scope.tags = [];
        this.$scope.cancel = this.cancel;
    }

    cancel() {
        console.log("cancel clicked");
    }
}

let PostSettings = {
    controller: PostSettingsCtrl,
    template: require('./settings.html')
};

export default PostSettings;