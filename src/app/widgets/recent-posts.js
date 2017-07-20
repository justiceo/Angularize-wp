export class RecentPostsCtrl {
    constructor(PostService, RestApi2) {
        PostService.ready().then(
            () => {
                this.posts = PostService.$restApi.posts({'per_page': 5})
                this.posts.get();
            }
        );

        RestApi2.ready().then(
            $restApi => {
                console.log("rest api 2: ", $restApi)
            }
        )
    }
}

let RecentPosts = {
    controller: RecentPostsCtrl,
    template: `
    <h2>Recent Posts</h2>
    <ul>
        <li ng-repeat="post in $ctrl.posts">
            <a href="{{ post.attr('link') }}">
                {{ post.attr('title').rendered }}
            </a>
        </li>
    </ul>
    `
}

export default RecentPosts;