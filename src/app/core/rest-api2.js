import Ajax from './ajax';

export default class RestApi2 {
    constructor($window, Ajax) {
        let namespace = '/wp/v2/';

        this.loadSchema = Ajax.get('').then( // this ajax call slows the startup time
            schema => {
                const routesSchema = Object.keys(schema.routes).map(r => r.replace("parent", "id").replace(namespace, ''));
                this.rootObject = new WpObject('', '', routesSchema)
                return this.rootObject;
            }
        )
    }

    ready() { return this.loadSchema }
}

class WpObject {
    constructor(self, parent, schema, state={}) {
        angular.extend(this,{self:self, parent:parent, schema:schema, state:state})
        this.endpoint = parent ? parent + '/' + self : self;

        let collections = schema.filter(e => e.replace(this.endpoint, '').indexOf('/') == -1)
        collections.forEach(c => this[c] = (args) => this.init(c, args) )
    }

    init(collection, args) {
        console.log("initing: ", collection)
        return new WpCollection(collection + this._serialize(args), this.endpoint, this.schema);
    }

    _serialize(obj) {
        if(obj == null || Object.keys(obj).length == 0) return "";
        return "?" + Object.keys(obj).map(function (key) {
            return key + '=' + encodeURIComponent(obj[key]);
        }).join('&')
    }

    /**
     * Returns a promise to fetch the model data from server and update local state
     * @param {Object} args 
     * @return Promise<WpObject>
     */
    get(args) {
        return Ajax.get(this.endpoint + this._serialize(args)).then(
            success => {
                angular.extend(this.state, success);
                if(args) {
                    console.log("get args: ", success);
                }
                return this;
            }
        )
    }

    /**
     * Returns the value of the property on this model.
     * If the property has a rendered extension, return the rendered extension
     * @param {string} prop 
     */
    attr(prop) {
        if(!(prop in this.state))
            throw 'The property "' + prop + '" does not exist on the model ' + this.parent
        
        let val = this.state[prop];
        if(val !== null && typeof val === 'object' && 'rendered' in val)
            return val.rendered

        return val
    }

    /**
     * Updates the current state with the model provided and sends update to server
     * If no model is provided for update, the current state is uploaded to the server
     * @param {object} model 
     */
    post(model) {
        let payload = model ? model : this._state;
        return Ajax.post(this.endpoint, payload).then(
            newState => {
                this._state = newState;
                return this;
            }
        )
    }

}

/**
 * An array of WpObjects
 */
class WpCollection extends Array {
    constructor(_endpoint, _parent, _schema) {
        super();
        this._route = _parent + '/' + _endpoint;

        //* wp.posts().id(2)       // returns a rest object with this id.
        this.id = (postId) => {
            let res = this.find(o => o.id == postId);
            if(res == null) {            
                res = new WpObject(postId, this._route, this._schema);
                this.push(res);
            }
            return res; 
        }

        // wp.posts().get()       // returns a promise to get the posts, using default params
        this.get = () => {
            // process args and append to route        
            return Ajax.get(this._route).then(
                posts => {
                    this._state = posts;
                    this._state.forEach(o => {
                        this.push(new WpObjectt(o.id, this._route, this._schema, o))
                    });
                    return this;
                }
            )
        }

        //* wp.posts().add({title: 'hello world'}) // creates local model of post and returns it
        this.add = (args) => { // what if object with id already exists in collection
            let obj;
            if (args.id) //buggy
                obj = this.id(args.id);
            else
                obj = new WpObjectt("", this._route, this._schema);
            for (let key in args) {
                obj.attr(key, args[key])
            }
            this.push(obj);
            return obj;
        }
        
    }
}