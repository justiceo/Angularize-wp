
export class EditorialCtrl {
    constructor(RestApi) {
        this.RestApi = RestApi;
        RestApi.ready().then(() => {
                this.pendingPosts = RestApi.$wp_v2.posts({ 'status': 'pending', '_embed': true })
                this.pendingPosts.get().then(() => {
                    this.pendingPosts.map(p => {
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
                    });
                })
                

                this.draftPosts = RestApi.$wp_v2.posts({ 'status': 'draft', '_embed': true })
                this.draftPosts.get().then(() =>{
                    this.draftPosts.map(p => {
                        p.authorName = p.attr('_embedded')['author']['name'];
                        return p;
                    });
                });
                
            }
        )
    }

    messageAuthor(authorId) {
        console.log("messaging author: ", authorId);
    }

    delete(postId) {
        console.log("deleting post with id:", postId);
        this.RestApi.$wp_v2.posts().id(postId).delete().then(
            success => {
                console.log("successfully deleted: show toast");
            },
            err => {
                console.error("error deleting post");
            }
        )
    }

    editorPick(postId) {
        console.log("marking as editor pick: ", postId);
    }
}

let Editorial = {
    controller: EditorialCtrl,
    templateUrl: 'components/editorial.html',
    bindings: {
        modalInstance: '<',
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
}

export default Editorial;