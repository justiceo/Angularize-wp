export class RecentPostsCtrl {
    constructor($log, $scope, PostService) {
        $log.info("RecentPost: Initializing...");
        PostService.ready().then(
            () => {
                this.posts = PostService.$restApi.posts({'per_page': 5})
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
                {{ post.attr('title').rendered }}
            </a>
        </li>
    </ul>
    `
}

export default RecentPosts;