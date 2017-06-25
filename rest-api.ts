/// <reference path="./typings/index.d.ts" />

interface RestObjectI {
    id: number;
}

interface RestCollectionI {}

class RestCollection extends Array<RestObjectI> implements RestCollectionI {
    _state: Array<any> = [];
    _route;
    _modelRef;
    constructor(public _endpoint, public _parent, public _schema) {
        super();
        this._route = _parent + '/' + _endpoint;
        this._modelRef = new RestObject(this._schema.getModel(this._route), this._route,  this._schema);       
    }
    
    // wp.posts().rawVal()    // returns an empty collection, the raw reference - do not use
    rawVal = () => {
        return this._state;
    }

    currentID = () => {
        return this.id(window.angularize_server.postObject.ID);
    }

    //* wp.posts().id(2)       // returns a rest object with this id.
    id = (postId) => {
        let res = this.find(o => o.id == postId);
        if(res == null) {            
            res = new RestObject(postId, this._route, this._schema);
            this.push(res);
            // todo: update internal model
        }
        return res; 
    }

    // wp.posts().get()       // returns a promise to get the posts, using default params
    get = () => {
        // process args and append to route        
        return this._schema.ajax.get(this._route).then(
            posts => {
                this._state = posts;
                this._state.forEach(o => {
                    this.push(new RestObject(o.id, this._route, this._schema, o))
                });
                return this;
            }
        )
    }

    //* wp.posts().add({title: 'hello world'}) // creates local model of post and returns it
    add = (args: any) => { // what if object with id already exists in collection
        let obj;
        if (args.id) //buggy
            obj = this.id(args.id);
        else
            obj = new RestObject("", this._route, this._schema);
        for (let key in args) {
            obj.attr(key, args[key])
        }
        this.push(obj);
        return obj;
    }
}

class RestObject implements RestObjectI {
    _route;
    _args;
    id;
    isModified;
    constructor(public _endpoint, public _parent, public _schema, public _state={}) {
        this._route = _parent ? _parent + '/' + _endpoint : _endpoint;

        // get the args for the different methods and append them
        let args = _schema.getArgs(this._route);
        this._args = args;
        this._args.deep = args;

        // add collections that extend from there
        if (_schema) {
            _schema.getCollections(this._route).forEach(e => {
                // do stuff like wp.posts({title: 'hello'})
                this[e] = (args) => this.init(e, args);
            });
        }
    }

    // wp.init('posts', {'per_page': 5}) // same as above
    init(type: string, args?): Array<RestObjectI> {
        let endpoint = type + this._serialize(args);
        let collection = new RestCollection(endpoint, this._route, this._schema);
        return collection;
    }

    _serialize(obj): string {
        if(obj == null || Object.keys(obj).length == 0) return "";
        // todo: check validity of keys too
        return "?" + Object.keys(obj).map(function (key) {
            return key + '=' + encodeURIComponent(obj[key]);
        }).join('&')
    }

    rawVal(): Object {
        return this._state;
    }
    //// returns a promise to get the model and update rawVal
    get(): Promise<Object> {
        return this._schema.ajax.get(this._route).then(
            success => {
                this._extend(this._state, success);
                return this;
            }
        )
    }

    attr(...args): any {
        if (args.length == 1)
            return this.getAttr(args[0]);
        else if (args.length = 2)
            return this.setAttr(args[0], args[1])
        else
            throw "Wrong number of arguments";
    }

    getAttr(prop: string): any {
        return this._state[prop];
    }

    setAttr(prop: string, value: any): any {
        this._state[prop] = value;
        this.isModified = true;
    }

    post(args: any): Promise<Object> {
        let payload = {};
        // if nothing is specified in payload, then push the whole object, else push only what's specified
        if (!args)
            payload = this._state;
        else {
            payload = args;
        }
        return this._schema.ajax.post(this._route, payload).then(
            success => {
                this._state = success;
                // use self_link this._route = 
                return this;
            }
        )
    }

    _extend(a, b) {
        for (var key in b)
            if (b.hasOwnProperty(key))
                a[key] = b[key];
        return a;
    }

}

/**
 * Fetches the API discovery and creates the endpoints
 * Provides methods for querying models and collections
 */
class Schema {
    schema: any;
    routes: Array<string>;
    constructor(public ajax, public index="/wp-json", public namespace="/wp/v2") {        
        ajax.root = index + namespace;   // todo: this affects all requests even those made outside rest api!!!!!!        
    }

    load() {
        return this.ajax.get("").then(
            schema => {
                this.schema = schema;                      
                this.routes = Object.keys(this.schema.routes).map(r => r.replace("parent", "id").replace(this.namespace, ""));
            }
        )
    }

    getArgs(endpoint) {
        // todo: non-critical
        return {};
    }

    getModel(endpoint): string {
        let routes = this.routes;
        routes = routes.filter(r => this.isImmediate(endpoint, r) && !this.isCollection(r))
        if (routes.length == 0) return null;
        return routes[0].replace(endpoint + "/", "");
    }

    getCollections(endpoint): Array<string> {
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


export default class RestApi {
    $restApi = {};
    constructor($window, Ajax) {
        let schema = new Schema(Ajax);        
        return schema.load().then(
            success => {
                // cache this computation
                $window.angular.extend(this.$restApi, new RestObject("", "", schema));        
                $window.$restApi = this.$restApi;

                // load & make current user easily accessible
                let currentUser = this.$restApi.users().id("me");
                currentUser.get();
                $window.$restApi.currentUser = currentUser;
                return this.$restApi;
            }
        )
    }
}




