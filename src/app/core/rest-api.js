"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var RestCollection = (function (_super) {
    __extends(RestCollection, _super);
    function RestCollection(_endpoint, _parent, _schema) {
        var _this = _super.call(this) || this;
        _this._endpoint = _endpoint;
        _this._parent = _parent;
        _this._schema = _schema;
        _this._state = [];
        // wp.posts().rawVal()    // returns an empty collection, the raw reference - do not use
        _this.rawVal = function () {
            return _this._state;
        };
        _this.currentID = function () {
            return _this.id(window.angularize_server.postObject.ID);
        };
        //* wp.posts().id(2)       // returns a rest object with this id.
        _this.id = function (postId) {
            var res = _this.find(function (o) { return o.id == postId; });
            if (res == null) {
                res = new RestObject(postId, _this._route, _this._schema);
                _this.push(res);
                // todo: update internal model
            }
            return res;
        };
        // wp.posts().get()       // returns a promise to get the posts, using default params
        _this.get = function () {
            // process args and append to route        
            return _this._schema.ajax.get(_this._route).then(function (posts) {
                _this._state = posts;
                _this._state.forEach(function (o) {
                    _this.push(new RestObject(o.id, _this._route, _this._schema, o));
                });
                return _this;
            });
        };
        //* wp.posts().add({title: 'hello world'}) // creates local model of post and returns it
        _this.add = function (args) {
            var obj;
            if (args.id)
                obj = _this.id(args.id);
            else
                obj = new RestObject("", _this._route, _this._schema);
            for (var key in args) {
                obj.attr(key, args[key]);
            }
            _this.push(obj);
            return obj;
        };
        _this._route = _parent + '/' + _endpoint;
        _this._modelRef = new RestObject(_this._schema.getModel(_this._route), _this._route, _this._schema);
        return _this;
    }
    return RestCollection;
}(Array));
var RestObject = (function () {
    function RestObject(_endpoint, _parent, _schema, _state) {
        if (_state === void 0) { _state = {}; }
        var _this = this;
        this._endpoint = _endpoint;
        this._parent = _parent;
        this._schema = _schema;
        this._state = _state;
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
    RestObject.prototype.get = function (args) {
        var _this = this;
        return this._schema.ajax.get(this._route + this._serialize(args)).then(function (success) {
            _this._extend(_this._state, success);
            if (args) {
                console.log("get args: ", success);
            }
            return _this;
        });
    };
    RestObject.prototype.attr = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
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
    RestObject.prototype.post = function (args) {
        var _this = this;
        var payload = {};
        // if nothing is specified in payload, then push the whole object, else push only what's specified
        if (!args)
            payload = this._state;
        else {
            payload = args;
        }
        return this._schema.ajax.post(this._route, payload).then(function (success) {
            _this._state = success;
            // use self_link this._route = 
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
/**
 * Fetches the API discovery and creates the endpoints
 * Provides methods for querying models and collections
 */
var Schema = (function () {
    function Schema(ajax, index, namespace) {
        if (index === void 0) { index = "/wp-json"; }
        if (namespace === void 0) { namespace = "/wp/v2"; }
        this.ajax = ajax;
        this.index = index;
        this.namespace = namespace;
        ajax.root = index + namespace; // todo: this affects all requests even those made outside rest api!!!!!!        
    }
    Schema.prototype.load = function () {
        var _this = this;
        return this.ajax.get("").then(function (schema) {
            _this.schema = schema;
            _this.routes = Object.keys(_this.schema.routes).map(function (r) { return r.replace("parent", "id").replace(_this.namespace, ""); });
        });
    };
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
var RestApi = (function () {
    function RestApi($window, Ajax) {
        var _this = this;
        this.$restApi = {};
        var schema = new Schema(Ajax);
        return schema.load().then(function (success) {
            // cache this computation
            $window.angular.extend(_this.$restApi, new RestObject("", "", schema));
            $window.$restApi = _this.$restApi;
            // load & make current user easily accessible
            var currentUser = _this.$restApi.users().id("me");
            currentUser.get();
            $window.$restApi.currentUser = currentUser;
            return _this.$restApi;
        });
    }
    return RestApi;
}());
exports["default"] = RestApi;
