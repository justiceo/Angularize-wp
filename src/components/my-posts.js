
export class MyPostsCtrl {
    constructor($log, RestApi) {
        this.RestApi = RestApi;

        let extractEmbeddedFields = (p) => {
            p.featuredImage = "https://www.jainsusa.com/images/store/landscape/not-available.jpg";
            try {
                p.editLink = window.location.origin + "/new-post/?id=" + p.attr('id');
                p.authorName = p.state._embedded['author'][0]['name'];
                p.authorLink = p.state._embedded['author'][0]['link'];
                p.featuredImage = p.state._embedded['wp:featuredmedia'][0].source_url; 
            } catch(e) {
                console.log("unable to set (author or) featured image for post: ", p.attr('title'))
            }                                               
            return p;
        }
        
        RestApi.ready().then(() => {
                this.posts = RestApi.$wp_v2.posts({ author: RestApi.$server.currentUser.ID })
                this.posts.get().then(() => {
                    this.posts.map(extractEmbeddedFields);
                })
            }
        )
    }

    refresh() {
        console.log("refresh clicked");
    }

    delete(postId) {
        console.log("deleting post with id:", postId);
        this.RestApi.$wp_v2.posts().id(postId).delete().then(
            success => {
                this.posts = this.posts.filter(p => p.attr('id') != postId);
                console.log("successfully deleted: show toast");
            },
            err => {
                console.error("error deleting post");
            }
        )
    }
}

let MyPosts = {
    controller: MyPostsCtrl,
    templateUrl: 'components/my-posts.html'
}

export default MyPosts;