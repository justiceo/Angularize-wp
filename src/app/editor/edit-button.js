/** Adds edit-button to toolbar, that which clicked launches the "new-post" component with the current post as it's postId
 */

export class EditPostCtrl {
    constructor(ToolbarService) {
        ToolbarService.add({
            id: 'angularize_editor_post',
            title: 'Edit',
            icon: 'check',
            position: 1,
            handler: () => this.launchEdit()
        })
    }

    launchEdit() {
        // opens a fullpage modal of the post? -- winner - better performance, more feasible too
        // or take them to edit-page? how to we pass in post id?
        // use localStorage to store post to edit? - faster to implement tho

        console.log("edit post clicked")
    }
}

let EditPost = {
    controller: EditPostCtrl
}

export default EditPost;