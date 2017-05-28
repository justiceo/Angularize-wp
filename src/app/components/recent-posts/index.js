//import RecentPosts from './recent-posts';
export class RecentPosts {
    constructor(PostService) {
        PostService.get_posts().then(
            posts => this.posts = posts.slice(0,5)            
        );
    }
}

let RecentPostsComponent = {
    controller: RecentPosts,
    template: require('./recent-posts.html')
}

export default RecentPostsComponent;