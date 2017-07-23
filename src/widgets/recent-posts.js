export class RecentPostsCtrl {
    constructor(RestApi) {
        RestApi.ready().then(
            $restApi => {
                this.posts = $restApi.posts({'per_page': 5})
                this.posts.get();
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
                {{ post.attr('title') }}
            </a>
        </li>
    </ul>
    `
}

export default RecentPosts;