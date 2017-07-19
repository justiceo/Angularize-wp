
export default class MockService {
    constructor($q){
        this.$q = $q;

        this.angularize_server = {
            nonce: 'aw23jdfr60',
            currentUser: {},
            postObject: {},
        }

        this.toMock = [
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
    }

    resolve(type, url) {
        console.warn('MOCK: resolved [' + type + '] ' + url)
        // returns a promise
    }
}