/// <reference path="./typings/index.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RestCollection = (function (_super) {
    __extends(RestCollection, _super);
    function RestCollection(_endpoint, _parent, _schema) {
        _super.call(this);
        this._endpoint = _endpoint;
        this._parent = _parent;
        this._schema = _schema;
        this._state = [];
        this._route = _parent + '/' + _endpoint;
        this._modelRef = new RestObject(this._schema.getModel(this._route), this._route, this._schema);
    }
    // wp.posts().rawVal()    // returns an empty collection, the raw reference - do not use
    RestCollection.prototype.rawVal = function () {
        return this._state;
    };
    //* wp.posts().id(2)       // returns a rest object with this id.
    RestCollection.prototype.id = function (postId) {
        var res = this.find(function (o) { return o.id == postId; });
        if (res == null) {
            res = new RestObject(postId, this._route, this._schema);
            this.push(res);
        }
        return res;
    };
    // wp.posts().get()       // returns a promise to get the posts, using default params
    RestCollection.prototype.get = function () {
        var _this = this;
        // process args and append to route        
        return this.Ajax.get(this._route).then(function (success) {
            _this._state = success.data;
            _this._state.forEach(function (o) {
                _this.push(new RestObject(o.id, "parent", _this._schema));
            });
            _this.isLoaded = true;
            return _this;
        });
    };
    //* wp.posts().add({title: 'hello world'}) // creates local model of post and returns it
    RestCollection.prototype.add = function (args) {
        var obj;
        if (args.id && this.id(args.id).isLoaded)
            obj = this.id(args.id);
        else
            obj = new RestObject("temporary_id", this._parent, this._schema);
        for (var key in args) {
            obj.attr(key, args[key]);
        }
        this.push(obj);
        return obj;
    };
    return RestCollection;
}(Array));
var RestObject = (function () {
    function RestObject(_endpoint, _parent, _schema) {
        var _this = this;
        this._endpoint = _endpoint;
        this._parent = _parent;
        this._schema = _schema;
        this._route = _parent ? _parent + '/' + _endpoint : _endpoint;
        // get the args for the different methods and append them
        var args = _schema.getArgs(this._route);
        this._args = args;
        this._args.deep = args;
        // add collections that extend from there
        if (_schema) {
            _schema.getCollections(this._route).forEach(function (e) {
                // do stuff like wp.posts({title: 'hello'})
                _this[e] = function (args) { return _this.init(e, args); };
            });
        }
    }
    // wp.init('posts', {'per_page': 5}) // same as above
    RestObject.prototype.init = function (type, args) {
        var endpoint = type + this._serialize(args);
        var collection = new RestCollection(endpoint, this._route, this._schema);
        return collection;
    };
    RestObject.prototype._serialize = function (obj) {
        if (obj == null || Object.keys(obj).length == 0)
            return "";
        // todo: check validity of keys too
        return "?" + Object.keys(obj).map(function (key) {
            return key + '=' + encodeURIComponent(obj[key]);
        }).join('&');
    };
    RestObject.prototype.rawVal = function () {
        return this._state;
    };
    //// returns a promise to get the model and update rawVal
    RestObject.prototype.get = function () {
        var _this = this;
        return this.Ajax.get(this._route).then(function (success) {
            _this._extend(_this._state, success.data);
            _this.isLoaded = true;
            return _this;
        });
    };
    RestObject.prototype.attr = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (args.length == 1)
            return this.getAttr(args[0]);
        else if (args.length = 2)
            return this.setAttr(args[0], args[1]);
        else
            throw "Wrong number of arguments";
    };
    RestObject.prototype.getAttr = function (prop) {
        return this._state[prop];
    };
    RestObject.prototype.setAttr = function (prop, value) {
        this._state[prop] = value;
        this.isModified = true;
    };
    RestObject.prototype.post = function () {
        var _this = this;
        var attr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            attr[_i - 0] = arguments[_i];
        }
        var payload = {};
        // if nothing is specified in payload, then push the whole object, else push only what's specified
        if (attr.length == 0)
            payload = this._state;
        else {
            attr.forEach(function (a) { return payload[a] = _this._state[a]; });
        }
        return this.Ajax.post(this._route, payload).then(function (success) {
            return _this;
        });
    };
    RestObject.prototype._extend = function (a, b) {
        for (var key in b)
            if (b.hasOwnProperty(key))
                a[key] = b[key];
        return a;
    };
    return RestObject;
}());
var Schema = (function () {
    function Schema() {
        this.schema = {
            "routes": {
                "/wp/v2": {},
                "/wp/v2/posts": {},
                "/wp/v2/posts/(?P<id>[\\d]+)": {},
                "/wp/v2/posts/(?P<id>[\\d]+)/revisions": {},
                "/wp/v2/posts/(?P<parent>[\\d]+)/revisions/(?P<id>[\\d]+)": {},
                "/wp/v2/pages": {},
                "/wp/v2/pages/(?P<id>[\\d]+)": {}
            }
        };
        this.routes = Object.keys(this.schema.routes).map(function (r) { return r.replace("parent", "id"); });
    }
    Schema.prototype.getArgs = function (endpoint) {
        // todo: non-critical
        return {};
    };
    Schema.prototype.getModel = function (endpoint) {
        var _this = this;
        var routes = this.routes;
        routes = routes.filter(function (r) { return _this.isImmediate(endpoint, r) && !_this.isCollection(r); });
        if (routes.length == 0)
            return null;
        return routes[0].replace(endpoint + "/", "");
    };
    Schema.prototype.getCollections = function (endpoint) {
        var _this = this;
        var routes = this.routes;
        return routes.filter(function (r) { return _this.isImmediate(endpoint, r) && _this.isCollection(r); }).map(function (r) { return r.replace(endpoint + "/", ""); });
    };
    Schema.prototype.isCollection = function (endpoint) {
        return !endpoint.endsWith("[\\d]+)"); // todo: improve targetting
    };
    Schema.prototype.isImmediate = function (endpoint, newEndpoint) {
        var diff = newEndpoint.replace(endpoint, "");
        return (newEndpoint.startsWith(endpoint)) && (diff.match(/\//g) || []).length == 1;
    };
    Schema.prototype.onlyUnique = function (value, index, self) {
        return self.indexOf(value) === index;
    };
    return Schema;
}());
var schema = new Schema();
var ro = new RestObject("/wp/v2", "", schema);
var require;
var util = require('util');
console.log(util.inspect(ro, false, null));
console.log(util.inspect(ro.pages(), false, null));
console.log(util.inspect(ro.posts(), false, null));
