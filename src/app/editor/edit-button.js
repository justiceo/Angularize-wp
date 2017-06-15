/** Adds edit button to single-post if front-end editor is available */
export class EditPostCtrl {
    constructor() {
        let origin = window.location.protocol + "//" + window.location.hostname;
        let id = window.wp_rest_object.postObject.ID;
        this.editLink = origin + '/wp-admin/post.php?post=' + id + '&action=edit&post_type=post'
    }
}

let EditPost = {
    controller: EditPostCtrl,
    template: `
    <a href="{{ $ctrl.editLink }}" class="post-edit-link">Edit Post</a>
    <style>
        .post-edit-link {
            position: fixed;
            top: 150px;
            left: 20px;
            background: yellow;
            color: black !important;
            padding: 5px 8px;
            
        }
    </style>
    `
}

export default EditPost;