
export class EditorialCtrl {
    constructor(RestApi) {
        RestApi.ready().then(() => {
                this.posts = RestApi.$wp_v2.posts({ author: RestApi.$server.currentUser.ID })
                this.posts.get()
            }
        )
    }
}

let Editorial = {
    controller: EditorialCtrl,
    templateUrl: 'components/editorial.html'
}

export default Editorial;