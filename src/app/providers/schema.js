
var _ = require("underscore");

class RestCollection {

    constructor(endpoint, Schema) {
        this._value = []; 
        this._endpoint = endpoint;
        this._modelRef = new RestObject(this._endpoint + '/' + Schema.getModel(endpoint), Schema);
    }

    at(index) { return this._value.splice(index, 1); }
    id(postId) { return this._value.filter(p => p.id == postId); }

    val() { return this._value }
    get(args) { } // for getting posts
    post(payload) { } // for adding new data of type _modelRef;    
}

class RestObject {
    constructor(endpoint, Schema) {
        this._endpoint = endpoint;

        Schema.getCollections(endpoint).forEach(e => {
            this[e] = new RestCollection(this._endpoint + '/' + e, Schema);
        });
    }

    $(route) {
        // endpoint must exist in childRef keys to be valid
        // update the child ref
        this[endpoint] = new RestObject("url", "", "");
        return this[endpoint];
    }

    val() { }
    get() {} // fetch the post
    post(data) { }
    put(args) { }
    delete(args) { }
    asPostType() { }

}

class Schema {
    constructor() {
        this.schema = {
            "routes": {
                "/wp/v2": {

                },
                "/wp/v2/posts": {

                },
                "/wp/v2/posts/(?P<id>[\\d]+)": {

                },
                "/wp/v2/posts/(?P<id>[\\d]+)/revisions": {},
                "/wp/v2/posts/(?P<parent>[\\d]+)/revisions/(?P<id>[\\d]+)": {},
                "/wp/v2/pages": {},
                "/wp/v2/pages/(?P<id>[\\d]+)": {},
            }
        }
        this.routes = Object.keys(this.schema.routes).map(r => r.replace("parent", "id"));
    }

    getModel(endpoint) {
        let routes = this.routes;
        routes = routes.filter(r => this.isImmediate(endpoint, r) && !this.isCollection(r))
        return _.first(routes).replace(endpoint + "/", "");
    }

    getCollections(endpoint) {
        let routes = this.routes;
        return routes.filter(r => this.isImmediate(endpoint, r) && this.isCollection(r)).map(r => r.replace(endpoint + "/", ""));        
    }

    isCollection(endpoint) {
        return !endpoint.endsWith("[\\d]+)"); // todo: improve targetting
    }

    isImmediate(endpoint, newEndpoint) {
        let diff = newEndpoint.replace(endpoint, "");
        return (newEndpoint.startsWith(endpoint)) && (diff.match(/\//g) || []).length == 1
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
}

var schema = new Schema();
var ro = new RestObject("/wp/v2", schema);
const util = require('util');
console.log(util.inspect(ro, false, null));


