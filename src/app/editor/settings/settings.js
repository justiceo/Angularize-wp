
export class PostSettingsCtrl {
    constructor(PostService) {
        console.log("PostSettingsCtrl: postservice", PostService);
        this.categories = [];
        this.tags = [];
    }
}

let PostSettings = {
    controller: PostSettingsCtrl,
    template: require('./settings.html')
};

export default PostSettings;