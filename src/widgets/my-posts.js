
export class MyPostsCtrl {
    constructor(RestApi) {
        angular.extend(this, {
            'RestApi': RestApi
        });

        // register toolbar button
        RestApi.ready().then(() => {
                this.posts = RestApi.$restApi.posts({ author: RestApi.$wp.currentUser.ID })
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
            <h3>{{ post.attr('title') }}</h3>
            <span>{{ post.attr('date') }}</h3>
        </li>
    </ul>
    `
}

export default MyPosts;