
export class MyPostsCtrl {
    constructor(RestApi) {
        console.log("initializing my posts")
        // register toolbar button
        RestApi.ready().then(() => {
                this.posts = RestApi.$wp_v2.posts({ author: RestApi.$server.currentUser.ID })
                this.posts.get()
            }
        )
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