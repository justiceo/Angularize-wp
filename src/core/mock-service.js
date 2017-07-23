
export default class MockService {
    constructor($q){
        this.$q = $q;
        this.init();
    }

    resolve(rejection) {
        let method = rejection.config.method, url = rejection.config.url;
        let res = this.endPoints.filter(e => e.method == method && e.url == url)
        res = res.length > 0 ? res[0] : null
        if(res){            
            console.warn('MOCK: resolved [' + method + '] ' + url);
            let success = {
                data: res.response
            }
            return this.$q.resolve(success);
        }

        return this.$q.reject(rejection);
    }

    mock(method, url, response) {
        let dup = this.endPoints.filter(e => e.method == method && e.url == url);
        if(dup) console.warn('MOCK: adding duplicate mocks for [' + method + '] ' + url);
        this.endPoints.push({method: method, url:url, response: response});
    }

    init() {
        this.isDev = window.location.origin === 'http://localhost:3000'
        
        if(this.isDev)
            window.angularize_server = {
                nonce: 'aw23jdfr60',
                currentUser: {},
                postObject: {},
            }

        this.endPoints = [
            {
                'method': 'GET',
                'url': 'http://localhost:3000/wp-json/wp/v2',
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
    }
}