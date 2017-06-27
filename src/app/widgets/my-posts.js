
export class MyPostsCtrl {
    constructor(PostService) {
        angular.extend(this, {
            'PostService': PostService
        });

        // register toolbar button
        PostService.ready().then(() => {
                this.posts = PostService.$restApi.posts({ author: PostService.$wp.currentUser.ID })
                this.posts.get();
            }
        )

        // fetch posts and cache
    }
}

let MyPosts = {
    controller: MyPostsCtrl,
    template: `
    <h3>My posts</h3>
    <ul>
        <li ng-repeat="post in $ctrl.posts">
            <h3>{{ post.title.rendered }}</h3>
            <span>{{ post.date }}</h3>
        </li>
    </ul>
    `
}

export default MyPosts;