/**
 * PostService
 * contains information about the current post (could be page, attachement etc)
 */
export default class PostService {
    constructor($window, $q, $log, Ajax) {
        'ngInject';        
        $log.info("PostService: Initializing...");
        angular.extend(this, {'$window': $window, '$q': $q, '$log': $log, 'Ajax': Ajax});
        this.$wp = $window.wp_rest_object || {};
        this.post = this.$wp.postObject || {};
        $log.debug("PostService: postObject ", this.post);
        this.postRoute = Ajax.restRoute + "/posts";
    }
    
    // For properties, see: https://codex.wordpress.org/Function_Reference/$post
    the_post() { return this.post }

    get_posts() { 
        return this.Ajax.get(this.Ajax.restRoute + "/posts", true)
            .then(posts => this.$q.resolve(posts))
    }

    // See for properties: https://developer.wordpress.org/rest-api/reference/posts/ 
    get_post(postId = this.the_ID()) { return this.Ajax.get(this.Ajax.restRoute + "/posts/" + postId); }

    get_categories() { return this.Ajax.get(this.Ajax.restRoute + '/categories'); }

    get_tags() { return this.Ajax.get(this.Ajax.restRoute + '/tags'); }

    get_comments() { return this.Ajax.get(this.Ajax.restRoute + '/comments'); }

    get_post_comments(postId) { return this.Ajax.get(this.Ajax.restRoute + '/comments?post=' + postId); }

    get_post_revisions(postId) { return this.Ajax.get(this.Ajax.restRoute + '/posts/' + postId + '/revisions'); }

    get_media() { return this.Ajax.get(this.Ajax.restRoute + '/media'); }  

    get_statuses() { return this.Ajax.get(this.Ajax.restRoute + '/statuses'); }

    get(relRoute) {
        return this.Ajax.get(this.postRoute + relRoute);
    }

    updatePost(property, data, postId = the_ID()) {
        let payload = {
            property: data
        };
        return this.Ajax.post(this.postRoute + "/" + postId, payload).then(
            success => {
                return success;
            }
        )
    }
}
