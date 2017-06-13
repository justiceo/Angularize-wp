export default class RestObject {
    _route;
    _args;
    _state;
    id;
    isLoaded;
    isModified;
    constructor(_endpoint, _parent, _schema, _ajax) {
        this._route = _parent ? _parent + '/' + _endpoint : _endpoint;

        // get the args for the different methods and append them
        let args = _schema.getArgs(this._route);
        this._args = args;
        this._args.deep = args;
        this._schema = _schema;
        this._ajax = _ajax;

        // add collections that extend from there
        if (_schema) {
            _schema.getCollections(this._route).forEach(e => {
                // do stuff like wp.posts({title: 'hello'})
                this[e] = (args) => this.init(e, args);
            });
        }
    }

    // wp.init('posts', {'per_page': 5}) // same as above
    init(type, args) {
        let endpoint = type + this._serialize(args);
        let collection = new RestCollection(endpoint, this._route, this._schema);
        return collection;
    }

    _serialize(obj) {
        if(obj == null || Object.keys(obj).length == 0) return "";
        // todo: check validity of keys too
        return "?" + Object.keys(obj).map(function (key) {
            return key + '=' + encodeURIComponent(obj[key]);
        }).join('&')
    }

    rawVal() {
        return this._state;
    }
    //// returns a promise to get the model and update rawVal
    get() {
        return this._ajax.get(this._route).then(
            success => {
                this._extend(this._state, success.data);
                this.isLoaded = true;
                return this;
            }
        )
    }

    attr(...args) {
        if (args.length == 1)
            return this.getAttr(args[0]);
        else if (args.length = 2)
            return this.setAttr(args[0], args[1])
        else
            throw "Wrong number of arguments";
    }

    getAttr(prop) {
        return this._state[prop];
    }

    setAttr(prop, value) {
        this._state[prop] = value;
        this.isModified = true;
    }

    post(...attr) {
        let payload = {};
        // if nothing is specified in payload, then push the whole object, else push only what's specified
        if (attr.length == 0)
            payload = this._state;
        else {
            attr.forEach(a => payload[a] = this._state[a]);
        }
        return this._ajax.post(this._route, payload).then(
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