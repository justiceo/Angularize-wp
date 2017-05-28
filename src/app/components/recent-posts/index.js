export class RecentPostsCtrl {
    constructor(PostService) {
        PostService.get_posts().then(            
            posts => this.posts = posts.slice(0,5)            
        );
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