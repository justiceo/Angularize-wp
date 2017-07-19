/**
 * Ajax
 * provides wrapper for ajax calls to service,
 * with caching to reduce hits
 */
export default class Ajax {
    constructor($window, $http, $q, $log) {
        angular.extend(this, {'$window': $window, '$http': $http, '$q': $q, '$log': $log});
        this.root = window.location.protocol + "//" + window.location.hostname + "/wp-json/wp/v2";
        this.storage = $window.localStorage;
    }

    request(type, url, payload) {
        url = this.root + url;
        let req = payload ? this.$http[type](url, payload) : this.$http[type](url)
        return req.then(
            success => {
                this.$log.debug('AJAX: successfully processed [' + type + '] ' + url);
                return this.$q.resolve(success.data);
            },
            error => {
                this.$log.error("Error requesting " + url, error);
                // todo: if the request is from localhost (we're running isolated), return a mock response
                return this.$q.reject(error);
            }
        )
    }

    get(url, no_cache = false) {
        let cached = this.cache(url);
        if(!no_cache && cached) return this.$q.resolve(cached);     
        
        return this.request('get', url).then(
            data => {
                this.cache(url, data);
                return this.$q.resolve(data);
            }
        )
    }

    post(url, payload) { return this.request('post', url, payload) }    

    put(url, payload) { return this.request('put', url, payload) }

    delete(url) { return this.request('delete', url) }
    
    cache(key, value) {
        if(!value) return JSON.parse(this.storage.getItem(key));
        this.storage.setItem(key, JSON.stringify(value));
    }
}