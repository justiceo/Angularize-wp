export default class RestCollection extends Array {    
    _state = [];
    _route;
    _modelRef;
    isLoaded;
    constructor(_endpoint, _parent, _schema, _ajax) {
        super();
        this._endpoint = _endpoint;
        this._parent = _parent;
        this._schema = _schema;
        this._ajax = _ajax;
        this._route = _parent + '/' + _endpoint;
        this._modelRef = new RestObject(this._schema.getModel(this._route), this._route,  this._schema);
    }
    
    // wp.posts().rawVal()    // returns an empty collection, the raw reference - do not use
    rawVal = () => {
        return this._state;
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
        return this._ajax.get(this._route).then(
            success => {
                this._state = success.data;
                this._state.forEach(o => {
                    this.push(new RestObject(o.id, this._route, this._schema))
                })
                this.isLoaded = true;
                return this;
            }
        )
    }

    //* wp.posts().add({title: 'hello world'}) // creates local model of post and returns it
    add = (args) => { // what if object with id already exists in collection
        let obj;
        if (args.id && this.id(args.id).isLoaded) //buggy
            obj = this.id(args.id);
        else
            obj = new RestObject("temporary_id", this._parent, this._schema);
        for (let key in args) {
            obj.attr(key, args[key])
        }
        this.push(obj);
        return obj;
    }
}