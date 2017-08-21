
export class EditorialCtrl {
    constructor(RestApi) {
        RestApi.ready().then(() => {
                this.pendingPosts = RestApi.$wp_v2.posts({ 'status': 'pending' })
                this.pendingPosts.get({ _embed: true }).then(() => {
                    this.pendingPosts.map(p => {                        
                        p.authorName = p.attr('_embedded')['author']['name'];
                        console.log("pending:", p);
                        return p;
                    });
                })
                

                this.draftPosts = RestApi.$wp_v2.posts({ 'status': 'draft' })
                this.draftPosts.get({ _embed: true }).then(() =>{
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