/** Adds edit-button to toolbar, that which clicked launches the "new-post" component with the current post as it's postId
 */

export class EditPostCtrl {
    constructor(ToolbarService) {
        // todo: only display this on single posts
        if(PostService.$wp.isSingle && PostService.$wp.postObject.post_type == 'post')
            ToolbarService.add({
                id: 'angularize_editor_post',
                title: 'Edit',
                icon: 'check',
                position: 1,
                handler: () => this.launchEdit()
            })
        else {
            console.log("EditPost not getting initialized on this page")
        }
    }

    launchEdit() {
        // opens a fullpage modal of the post? -- winner - better performance, more feasible too
        // or take them to edit-page? how to we pass in post id?
        // use localStorage to store post to edit? - faster to implement tho

        // the modal should be lg or fullscreen
        // it should be appended to post-content element
        console.log("edit post clicked")
    }
}

let EditPost = {
    controller: EditPostCtrl
}

export default EditPost;