export class RecentPostsCtrl {
    constructor(RestApi) {
        RestApi.ready().then(
            $wp_v2 => {
                this.posts = $wp_v2.posts({'per_page': 5})
                this.posts.get();
            }
        )
    }
}

let RecentPosts = {
    controller: RecentPostsCtrl,
    templateURl : 'widgets/recent-posts.html'
}

export default RecentPosts;
