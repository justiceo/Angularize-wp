
export class PostSettingsCtrl {
    constructor($scope, PostService, ToolbarService) {
        console.log("PostSettingsCtrl: postservice", PostService);
        this.$scope = $scope;
        this.$scope.categories = [];
        this.$scope.tags = [];
        this.$scope.cancel = this.cancel;

        var settingsButton = {
			id: 'le_settings',
			title: 'Settings',
			icon: 'icon-settings',
			position: 4,
			handler: this.settingsHandler
		};
		ToolbarService.add(settingsButton);
    }

    settingsHandler() {
        console.log("clicked on settings: ", this);
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