/**
 * Ajax
 * provides wrapper for ajax calls to service,
 * with caching to reduce hits
 */
export default class Ajax {
    constructor($window, $http, $q) {
        angular.extend(this, {'$window': $window, '$http': $http, '$q': $q});
        this.storage = $window.localStorage;
        this.isDev = window.location.origin === 'http://localhost:8080';
        if(this.isDev) this.initMocks();
    }

    request(type, url, payload) {
        url = window.location.origin + "/wp-json/wp/v2" + url;
        let req = payload ? this.$http[type](url, payload) : this.$http[type](url)
        return req.then(
            success => {
                console.debug('AJAX: successfully processed [' + type + '] ' + url);
                return this.$q.resolve(success.data);
            },
            error => {
                if(this.isDev) {
                    console.warn('AJAX: mocking [' + type + '] ' + url)
                    return this.$q.resolve(this.mock(type, url));
                }
                console.error("Error requesting " + url, error);
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
        console.log("Ajax: Initializing mock endpoints")
        this.$window.angularize_server = {
            nonce: 'aw23jdfr60',
            currentUser: {},
            postObject: {},
        }
        let toMock = [
            {
                'type': 'get',
                'url': '', // schema root
                'response': {
                    routes: {
                        '/wp/v2': '',
                        '/wp/v2/posts':'',
                        '/wp/v2/posts/(?P<id>[\d]+)': '',
                        '/wp/v2/users':'',
                        '/wp/v2/users/(?P<id>[\d]+)':'',
                        '/wp/v2/users/me':'',
                        '/wp/v2/categories':'',
                        '/wp/v2/categories/(?P<id>[\d]+)':'',
                        '/wp/v2/tags':'',
                        '/wp/v2/tags/(?P<id>[\d]+)':'',
                    }
                }
            }
        ]
        toMock.forEach(e => this.cache(e.type + window.location.origin + "/wp-json/wp/v2" + e.url, e.response))
    }
}