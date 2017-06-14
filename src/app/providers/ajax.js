/**
 * Ajax
 * provides wrapper for ajax calls to service,
 * with caching to reduce hits
 */
export default class Ajax {
    constructor($window, $http, $q, $log, Cache) {
        'ngInject';
        $log.info("Ajax: Initializing...");
        angular.extend(this, {'$window': $window, '$http': $http, '$q': $q, '$log': $log, 'Cache': Cache});
        this.$wp = $window.wp_rest_object;

        this.origin = $window.location.protocol + "//" + $window.location.hostname;
        this.restRoute = this.origin + "/wp-json/wp/v2";
        this.root = "";
    }

    get(url, no_cache = false) {
        url = this.root + url;
        if(no_cache) this.Cache.remove(url);

        // Try the cache first
        var cached = this.Cache.get(url);
        if(cached) return this.$q.resolve(cached);        

        console.log("$.get: ", url);
        return this.$http.get(url).then(
            success => {
                this.Cache.set(url, success.data);
                return this.$q.resolve(success.data);
            },
            error => {
                this.$log.error("Error requesting " + url, error);
                return this.$q.reject(error);
            }
        )
    }

    post(url, payload) {
        url = this.root + url;
        return this.$http.post(url, payload).then(
            success => {
                return this.$q.resolve(success.data);
            },
            error => {
                this.$log.error("Error requesting " + url, error);
                return this.$q.reject(error);
            }
        )
    }    

    put(url, payload) {
        url = this.root + url;
        return this.$http.put(url, payload).then(
            success => {
                return this.$q.resolve(success.data);
            },
            error => {
                this.$log.error("Error requesting " + url, error);
                return this.$q.reject(error);
            }
        )
    }

    delete(url) {
        url = this.root + url;
        return this.$http.delete(url).then(
            success => {
                return this.$q.resolve(success.data);
            },
            error => {
                this.$log.error("Error requesting " + url, error);
                return this.$q.reject(error);
            }
        )
    }
}