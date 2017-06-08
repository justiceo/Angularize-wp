
var _ = require("underscore");

/**
 * wp = new RestObject("/wp/v2", Schema);
 * wp.posts()             // returns a rest collection obj, behave like real array that is super-charged
 * wp.posts({'per_page': 5, 'author': 1})   // returns a different reference from above
 * wp.posts()[2]          // returns a rest object by index
 * wp.posts().rawVal()    // returns an empty collection, the raw reference - do not use
 * wp.posts().latest()    // returns a reference to the collection, updates it
 * wp.posts().get()       // returns a promise to get the posts, using default params
 * wp.posts().id(2)       // returns a rest object
 * wp.posts().find({id: 2})   // returns a rest object
 * wp.posts().more()          // should support pagination, hence next page if any
 * wp.posts().id(2).rawVal()  // returns the reference to model backing the rest object, null otherwise
 * wp.posts().id(2).latest()  // returns a reference to rawVal and updates it, non-nullable
 * wp.posts().id(2).get()     // returns a promise to get the model and update rawVal
 * wp.posts().id(2).sync()    // update post 2 on the server, prevents overwriting newer changed model
 * wp.posts().id(2).post()    // updates post 2 on the server, regardless of newer changes.
 * wp.posts().id(2).attr("title") // returns the title attribute of the post, null otherwise
 * wp.posts().id(2).attr("title", "hello world")  // update the title of post 2
 * wp.posts().id(2).attrs     // returns a list of attributes on the post
 * // creating and updating
 * wp.posts().add({title: 'hello world'}) // creates local model of post and returns it
 * wp.posts().add({title: 'hello world'}).sync()  // creates a new post on the server
 * wp.posts().sync()          // download remote changes (via revisions), upload local revisions via sync on actual objects
 * wp.posts().id(2).revisions() // returns a rest collection obj
 */
class RestCollection {

    constructor(endpoint, parent, Schema) {
        this._schema = Schema;
        this._value = [];
        this._parent = parent;
        this._route = this._parent + '/' + endpoint;
        this._modelRef = new RestObject(Schema.getModel(this._route), this._route,  Schema);

        // process args
    }

    at(index) { 
        // fetch object at index
        let value = this._value.splice(index, 1); // check bounds
        return new RestObject(value.id, this._route, this._schema, value);
    }

    id(postId) {
        let postArr = this._value.filter(p => p.id == postId);
        let value = postArr.size() == 0 ? null: postArr[0]
        return new RestObject(postId, this._route, this.Schema, value);
    }

    val() { return this._value }

    valOrGet() {
        if(this._value)
            return this._value;
        this.get();
        return this._value;
    }

    get(args) {
        // process args and append to route
        return this.Ajax.get(this._route).then(
            success => {
                success.data.forEach(e => this._value.push(this.toRestObj(e)));
                return this._value;
            }
        )
     } 

     toRestObj(e) {
         return new RestObject(); // complete here
     }

    post(payload) { 
        return this.Ajax.post(this._route, payload).then(
            success => {
                return success.data;
            }
        )
    }    
}

class RestObject {
    constructor(endpoint, parent, Schema, model) {
        this._parent = parent;
        this._route = this._parent + '/' + endpoint;
        this._model = model;

        // get the args for the different methods and append them
        let args = Schema.getArgs(this._route);
        this._args = this.trimArgs(args);
        this._args.deep = args;

        // add collections that extend from there
        if(Schema) {
        Schema.getCollections(this._route).forEach(e => {
            this[e] = new RestCollection(e, this._route, Schema);
        });
        }
    }

    trimArgs(args) {
        // todo: non-critical
        return args;
    }

    $(route) {
        if (!this[route])
            throw this._route + '/' + route + " - route not reachable from model"
        return this[route];
    }

    val() { return this._model; }
    get(args) { } // fetch the post
    post(args) { }
    put(args) { }
    delete(args) { }
    asPostType() { }
    args() { } // returns the arguments for the different post types
    extend(a, b) {
        for (var key in b)
            if (b.hasOwnProperty(key))
                a[key] = b[key];
        return a;
    }

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

    getArgs(endpoint) {
        // todo: non-critical
        return {};
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


