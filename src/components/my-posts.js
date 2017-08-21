
export class MyPostsCtrl {
    constructor(RestApi) {
        RestApi.ready().then(() => {
                this.posts = RestApi.$wp_v2.posts({ author: RestApi.$server.currentUser.ID })
                this.posts.get()
            }
        )
    }
}

let MyPosts = {
    controller: MyPostsCtrl,
    templateUrl: 'components/my-posts.html'
}

export default MyPosts;