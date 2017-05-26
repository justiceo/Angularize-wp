/**
 * Ajax
 * provides wrapper for ajax calls to service,
 * with caching to reduce hits
 */
export default class Ajax {
    constructor($window, $http, $q, $log, Cache) {
        'ngInject';
        angular.extend(this, {'$window': $window, '$http': $http, '$q': $q, '$log': $log, 'Cache': Cache});
        this.$wp = $window.wp_rest_object;

        //this.origin = $window.location.protocol + "//" + $window.location.hostname;
        this.origin = 'http://dev3.kasomafrica.com';
        this.restEndpoint = this.origin + "/wp-json/wp/v2";
        this.postEndpoint = this.restEndpoint + "/posts"
    }

    get(url, no_cache = false) {

        if(no_cache) this.Cache.remove(url);

        // Try the cache first
        var cached = this.Cache.get(url);
        if(cached) return this.$q.resolve(cached);

        return this.$http({
            url: url,
            method: 'GET',
            beforeSend: (xhr) => {
                xhr.setRequestHeader('X-WP-Nonce', this.$wp.nonce);
            }
        }).then(
            success => {
                this.Cache.set(url, success);
                return this.$q.resolve(success);
            },
            error => {
                this.$log.error("Error requesting " + url, error);
                return this.$q.reject(error);
            }
        )
    }
    
    // short-hands
    get_post(postId) { return this.get(this.postEndpoint) }
}