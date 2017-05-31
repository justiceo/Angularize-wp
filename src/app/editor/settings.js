
export class PostSettingsCtrl {
    constructor(PostService) {
        console.log("PostSettingsCtrl: postservice", PostService)
    }
}

let PostSettings = {
    controller: PostSettingsCtrl,
    template: `<p>post settings template</p>`
};

export default PostSettings;