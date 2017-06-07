
class RestCollection {

    constructor(endpoint, Schema) {

        this._root = null;
        this._value = []; // should extend underscore array functions
        this._modelRef = null;

        if (!endpoint) return;
        console.log("creating rest coll ", endpoint);
        // anything that is not verifyably a collection
        this._modelRef = new RestObject(Schema.getModel(endpoint), Schema);
    }

    at(index) { return this._value.splice(index, 1); }
    id(postId) { return this._value.filter(p => p.id == postId); }

    val() { return this._value }
    get(args) { } // for getting posts
    post(payload) { } // for adding new data of type _modelRef;    
}

class RestObject {


    constructor(endpoint, Schema) {
        this.childRefs = {};
        if (!endpoint) return;
        console.log("creating rest object ", endpoint);
        Schema.getCollections(endpoint).forEach(e => {
            this.childRefs[e] = new RestCollection(e, Schema);
        });
    }

    $(route) {
        // endpoint must exist in childRef keys to be valid
        // update the child ref
        this[endpoint] = new RestObject("url", "", "");
        return this[endpoint];
    }
    val() { }
    get() {
        // fetch the post
    }
    post(data) { }
    put(args) { }
    delete(args) { }
    asPostType() { }

}

class Schema {
    // fetch the json root
    // create the object and print it to console

    constructor() {/*
        $http.get("http://snow.2rof.com/wp-json/wp/v2/").then(
            success => {
                console.log(success.data);
                this.schema = success.data;
            }
        )*/
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
    }

    getModel(endpoint) {
        let routes = Object.keys(this.schema.routes);
        routes = routes.filter(r => r.startsWith(endpoint)).map(r => r.replace(endpoint, ""));
        routes = routes.filter(r => r == "/(?P<id>[\\d]+)" || r == "/(?P<parent>[\\d]+)");
        if (routes.length > 0)
            return endpoint + routes[0];

        //routes = routes.map(r => endpoint + r.substring(endpoint.length. r.indexOf('/')));
        //return routes;
    }

    isModel(endpoint) {
        return !isCollection(endpoint);
    }

    isCollection(endpoint) {
        return !endpoint.endsWith("[\\d]+)"); // todo: improve targetting
    }

    getCollections(endpoint) {
        let routes = Object.keys(this.schema.routes);
        routes = routes.filter(r => r.startsWith(endpoint));
        // we just need the end point names
        routes = routes.map(r => r.replace(endpoint + "/", ""));
        routes = routes.map(r => {
            if (r.indexOf('/') != -1)
                return r.substring(0, r.indexOf('/'));
            else return r;
        });
        routes = routes.filter(this.onlyUnique).filter(r => r != "").map(r => endpoint + "/" + r);
        return routes;
    }


    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
}

var schema = new Schema();
var ro = new RestObject("/wp/v2", schema);
console.log(ro);
