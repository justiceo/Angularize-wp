export class RecentPostsCtrl {
    constructor($log, $scope) {
        $log.info("RecentPost: Initializing...");
        let postCollection = new wp.api.collections.Posts();
        postCollection.fetch({ data: { per_page: 5}}).then(
            top5 => {
                this.posts = top5;
                $scope.$apply(); // because angular doesn't catch the above line
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
            <a href="{{ post.link }}">
                {{ post.title.rendered }}
            </a>
        </li>
    </ul>
    `
}

export default RecentPosts;