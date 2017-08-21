
export class EditorialCtrl {
    constructor(RestApi) {
        RestApi.ready().then(() => {
                this.pendingPosts = RestApi.$wp_v2.posts({ 'status': 'pending' })
                this.pendingPosts.get();

                this.draftPosts = RestApi.$wp_v2.posts({ 'status': 'draft' })
                this.draftPosts.get()
            }
        )
    }
}

let Editorial = {
    controller: EditorialCtrl,
    templateUrl: 'components/editorial.html'
}

export default Editorial;