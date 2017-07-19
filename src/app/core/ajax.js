/**
 * Ajax
 * provides wrapper for ajax calls to service,
 * with caching to reduce hits
 */
export default class Ajax {
    constructor($window, $http, $q) {
        angular.extend(this, {'$window': $window, '$http': $http, '$q': $q});
        this.storage = $window.localStorage;
    }

    request(type, url, payload) {
        url = window.location.origin + "/wp-json/wp/v2" + url;
        let req = payload ? this.$http[type](url, payload) : this.$http[type](url)
        return req.then(
            success => {
                console.debug('AJAX: successfully processed [' + type + '] ' + url);
                return this.$q.resolve(success.data);
            }
        )
    }

    mock(type, url) { return this.cache(type + url) }

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