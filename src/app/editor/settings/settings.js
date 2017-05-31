
export class PostSettingsCtrl {
    constructor($scope, PostService) {
        console.log("PostSettingsCtrl: postservice", PostService);
        this.categories = [];
        this.tags = [];
        this.$scope = $scope;
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