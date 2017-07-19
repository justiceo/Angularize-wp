/**
 * Ajax
 * provides wrapper for ajax calls to service,
 * with caching to reduce hits
 */
export default class Ajax {
    constructor($window, $http, $q, $log) {
        angular.extend(this, {'$window': $window, '$http': $http, '$q': $q, '$log': $log});
        this.storage = $window.localStorage;
        this.isDev = window.location.origin === 'http://localhost:8080';
        if(this.isDev) this.initMocks();
    }

    request(type, url, payload) {
        url = window.location.origin + "/wp-json/wp/v2" + url;
        let req = payload ? this.$http[type](url, payload) : this.$http[type](url)
        return req.then(
            success => {
                this.$log.debug('AJAX: successfully processed [' + type + '] ' + url);
                return this.$q.resolve(success.data);
            },
            error => {
                if(this.isDev) {
                    return this.mock(type, url);
                }
                this.$log.error("Error requesting " + url, error);
                return this.$q.reject(error);
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

    initMocks() {
        this.$log.debug("Ajax: Initializing mock endpoints")
        let toMock = [
            {
                'type': 'get',
                'url': '/posts/',
                'response': 'success!'
            }
        ]
        toMock.forEach(e => this.cache(e.type + e.url, e.response))
    }
}