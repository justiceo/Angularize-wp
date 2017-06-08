/// <reference path="./typings/index.d.ts" />

interface RestObjectI {
    rawVal(): Object;
    get(): Promise<Object>;
    post(args: Object): Promise<Object>;
    //sync(): Promise<Object>;
    //attr(prop: string): Object;
    //attr(prop: string, value: Object): boolean;
    //attrs(): Array<string>;    
}

interface RestCollectionI {
    rawVal(): Array<any>
    get(args?: Object): Promise<Array<RestObjectI>>
    post(): Promise<Array<RestObjectI>>
    //sync(): Promise<Array<RestObjectI>>
    id(id: number): RestObjectI
    //find(args: Object): RestObjectI
    //more(): Array<RestObjectI>   
}

class RestCollection extends Array<RestObjectI> implements RestCollectionI {
    _state: Array<any>;
    _route;
    _modelRef;
    constructor(public _endpoint, public _parent, public _schema) {
        super();
        this._state = [];
        this._route = _parent + '/' + _endpoint;
        this._modelRef = {}; // new RestObject(Schema.getModel(this._route), this._route,  Schema);
    }

    rawVal(): Array<any> {
        return this._state;
    }

    id(postId): RestObjectI {
        /*let postArr = this._state.filter(p => p.id == postId);
        let value = postArr.size() == 0 ? null: postArr[0]
        return new RestObject(postId, this._route, this._schema, value);*/
        return null;
    }

    get(args?): Promise<Array<RestObjectI>> {
        // process args and append to route
        /*
        return this.Ajax.get(this._route).then(
            success => {
                success.data.forEach(e => this._state.push(this.toRestObj(e)));
                return this._state;
            }
        )*/
        return null;
    }

    post(): Promise<Array<RestObjectI>> {
        return null;
    }
}

class RestObject implements RestObjectI {
    _route;
    _args;
    constructor(public _endpoint, public _parent, public _schema) {
        this._route = _parent + '/' + _endpoint;

        // get the args for the different methods and append them
        let args = _schema.getArgs(this._route);
        this._args = args;
        this._args.deep = args;

        // add collections that extend from there
        if (_schema) {
            _schema.getCollections(this._route).forEach(e => {
                this[e] = new RestCollection(e, this._route, _schema);
            });
        }
    }

    rawVal(): Object {
        return null;
    }

    get(): Promise<Object> {
        return null;
    }

    post(args: Object): Promise<Object> {
        return null;
    }

    extend(a, b) {
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
        if(routes.length == 0 ) return null;
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

var schema = new Schema();
var ro = new RestObject("/wp/v2", "wp-json/", schema);
console.log(ro);


