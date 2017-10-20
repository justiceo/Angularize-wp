/**
 * Ajax
 * provides wrapper for ajax calls to service,
 * with caching to reduce hits
 */
export default class AjaxService {
    constructor($log, $http, $q) {
        this.$http = $http;
        this.$q = $q;
        this.storage = window.sessionStorage;

        $log.info("Initialized AjaxService");

        this.never_cache = [
            '/users/me'
        ]
    }

    request(type, url, payload) {
        url = window.location.origin + "/wp-json" + url;
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
        // todo: handle redirect responses
        let cached = this.cache(url);
        if(!no_cache && cached && this.never_cache.indexOf(url) == -1) return this.$q.resolve(cached);     
        
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
        // todo: add expires
        // prepend 'angularize' in-front of every key, to avoid key conflicts
        if(!value) return JSON.parse(this.storage.getItem(key));
        this.storage.setItem(key, JSON.stringify(value));
        return this.cache(key);
    }
}