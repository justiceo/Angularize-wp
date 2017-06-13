/// <reference path="./typings/index.d.ts" />

interface RestObjectI {
    id: number;
    isLoaded: boolean;
    rawVal(): Object;
    get(): Promise<Object>;
    post(args: Object): Promise<Object>;
    attr(prop: string, value: any): void;
    //sync(): Promise<Object>;
    //attr(prop: string): Object;
    //attr(prop: string, value: Object): boolean;
    //attrs(): Array<string>;    
}

interface RestCollectionI {
    isLoaded: boolean;
    rawVal(): Array<any>
    get(args?: Object): Promise<Array<RestObjectI>>
    //sync(): Promise<Array<RestObjectI>>
    id(id: number): RestObjectI
    //find(args: Object): RestObjectI
    //more(): Array<RestObjectI>   
}

class RestCollection extends Array<RestObjectI> implements RestCollectionI {
    _state: Array<any> = [];
    _route;
    _modelRef;
    Ajax;
    isLoaded: boolean;
    constructor(public _endpoint, public _parent, public _schema, public _ajax) {
        super();
        this._route = _parent + '/' + _endpoint;
        this._modelRef = new RestObject(this._schema.getModel(this._route), this._route,  this._schema, this._ajax);

        this.Ajax = {
            get: (url) => this.ajax('get', url),
            post: (url, data) => this.ajax('post', url, data),
            "delete": (url) => this.ajax('delete', url)
        }

        
    }
    
    // wp.posts().rawVal()    // returns an empty collection, the raw reference - do not use
    rawVal = () => {
        return this._state;
    }

    ajax = (method, url, data?) => {
        let http = new XMLHttpRequest();
        http.open(method, url);
        if(data) http.send(data);
        else http.send();

        return {
            then: (success, fail) => {
                http.onreadystatechange = () => {
                    if(http.readyState != 4) return;
                    if(http.status == 200) success("success callback");
                    else fail("error callback");
                }
            }
        }
    }

    //* wp.posts().id(2)       // returns a rest object with this id.
    id = (postId) => {
        let res = this.find(o => o.id == postId);
        if(res == null) {            
            res = new RestObject(postId, this._route, this._schema, this._ajax);
            this.push(res);
            // todo: update internal model
        }
        return res; 
    }

    // wp.posts().get()       // returns a promise to get the posts, using default params
    get = () => {
        // process args and append to route        
        return this.Ajax.get(this._route).then(
            success => {
                this._state = success.data;
                this._state.forEach(o => {
                    this.push(new RestObject(o.id, this._route, this._schema, this._ajax))
                })
                this.isLoaded = true;
                return this;
            }
        )
    }

    //* wp.posts().add({title: 'hello world'}) // creates local model of post and returns it
    add = (args: any) => { // what if object with id already exists in collection
        let obj;
        if (args.id && this.id(args.id).isLoaded) //buggy
            obj = this.id(args.id);
        else
            obj = new RestObject("temporary_id", this._parent, this._schema, this._ajax);
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
    _state;
    id;
    isLoaded;
    isModified;
    Ajax;
    constructor(public _endpoint, public _parent, public _schema, public _ajax) {
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

        this.Ajax = {
            get: (url) => this.ajax('get', url),
            post: (url, data) => this.ajax('post', url, data),
            "delete": (url) => this.ajax('delete', url)
        }
    }

    // wp.init('posts', {'per_page': 5}) // same as above
    init(type: string, args?): Array<RestObjectI> {
        let endpoint = type + this._serialize(args);
        let collection = new RestCollection(endpoint, this._route, this._schema, this._ajax);
        return collection;
    }

    ajax(method, url, data?) {
        let http = new XMLHttpRequest();
        http.open(method, url);
        if(data) http.send(data);
        else http.send();

        return {
            then: (success, fail) => {
                http.onreadystatechange = () => {
                    if(http.readyState != 4) return;
                    if(http.status == 200) success("success callback");
                    else fail("error callback");
                }
            }
        }
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
        return this.Ajax.get(this._route).then(
            success => {
                this._extend(this._state, success.data);
                this.isLoaded = true;
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

    post(...attr): Promise<Object> {
        let payload = {};
        // if nothing is specified in payload, then push the whole object, else push only what's specified
        if (attr.length == 0)
            payload = this._state;
        else {
            attr.forEach(a => payload[a] = this._state[a]);
        }
        return this.Ajax.post(this._route, payload).then(
            success => {
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

class Schema {
    schema: any;
    routes: Array<string>;
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


export default class Rest {
    schema = null;
    wp = null;
    constructor(Ajax) {
        console.log("creating rest object")
        this.schema = new Schema();
        this.wp = new RestObject("/wp/v2", "", this.schema, Ajax);
        console.log("wp: ", this.wp);
    }
}




