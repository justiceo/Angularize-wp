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
        this.route = Ajax.restRoute + "/posts";
    }

    /**
     * Only common functions are exposed by this service, for additional data on the post object not exposed, 
     * You can get the rest of the info from the post object via `the_post()`
     * 
     * Ignored fields on postObject include:
     * - comment_count
     * - comment_status
     * - filter
     * - guid
     * - menu_order
     * - ping_status
     * - post_content_filtered
     * - post_date_gmt
     * - post_mime_type
     * - post_modified_gmt
     * - post_parent
     * - post_password
     * - to_ping
     */
    the_ID() { return this.post.ID }
    the_post() { return this.post }
    the_excerpt() { return this.post.post_exerpt }
    the_title() { return this.post.post_title }
    the_author() { return this.post.post_author } // returns author ID
    the_content() { return this.post.post_content }
    the_status() { return this.post.post_status }
    the_publish_date() { return this.post.post_date }
    the_last_modified() { return this.post.post_modified }
    the_name() { return this.post.post_name }
    is_post() { return this.post.post_type === 'post'}
    is_page() { return this.post.post_type === 'page'}

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
}
