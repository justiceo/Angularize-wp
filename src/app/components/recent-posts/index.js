 export class RecentPosts {
    constructor(PostService) {
        PostService.get_posts().then(            
            posts => this.posts = posts.slice(0,5)            
        );
    }
}

let RecentPostsComponent = {
    controller: RecentPosts,
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

export default RecentPostsComponent;