
export class EditorialCtrl {
    constructor(RestApi) {
        RestApi.ready().then(() => {
                this.pendingPosts = RestApi.$wp_v2.posts({ 'status': 'pending', '_embed': true })
                this.pendingPosts.get().then(() => {
                    this.pendingPosts.map(p => {
                        try {
                            p.authorName = p.state._embedded['author'][0]['name'];
                            p.featuredImage = p.state._embedded['wp:featuredmedia'][0].source_url;  

                        } catch(e) { 
                            console.log("unable to set featured image for post: ", p.attr('title'))
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
}

let Editorial = {
    controller: EditorialCtrl,
    templateUrl: 'components/editorial.html'
}

export default Editorial;