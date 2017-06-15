/** Adds edit button to single-post if front-end editor is available
 * Instead of adding an angular plugin for this, let's echo the edit link in the page
 * If wp-front-editor is installed
 */

export class EditPostCtrl {
    constructor() {
        let origin = window.location.protocol + "//" + window.location.hostname;
        let id = window.wp_rest_object.postObject.ID;
        this.editLink = origin + '/wp-admin/post.php?post=' + id + '&action=edit&post_type=post'

        // todo: add this as a toolbar button

        // todo: hide the button when already in edit mode
        // check if wp front end editor has hooks you can use to set this var on the server
        this.state = this.isDisabled ? "disabled" : "enabled"; 
    }
}

let EditPost = {
    controller: EditPostCtrl,
    template: `
    <a href="{{ $ctrl.editLink }}" class="post-edit-link {{ $ctrl.state }}">Edit Post</a>
    <style>
        .post-edit-link {
            position: fixed;
            top: 150px;
            left: 20px;
            background: yellow;
            color: black !important;
            padding: 5px 8px;
            
        }
        .post-edit-link.disabled {
            display: none;
        }
    </style>
    `
}

export default EditPost;