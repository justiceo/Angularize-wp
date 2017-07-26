import AjaxService from './ajax-service';
var $ajax = null; // make ajax available for WpObject & WpCollection

export default class RestApiService {
    constructor($http, $q) {        
        $ajax = new AjaxService($http, $q);
        this.ready = (namespace = '/wp/v2') => { 
            return $ajax.get(namespace).then(
                schema => {
                    let namespace_label =  '$' + namespace.replace(/\/$/, "").replace(/^\/+/g, '').replace('/','_');
                    if(this[namespace_label]) return this[namespace_label];

                    const routesSchema = Object.keys(schema.routes).map(r => r.replace("parent", "id"));//.replace(namespace + '/', ''));
                    console.group("building ", namespace)
                    this[namespace_label] = new WpObject('', namespace, routesSchema)
                    console.groupEnd();
                    return this[namespace_label];
                })}
       
        this.ready();
        this.ready('/angularize/v1');
    }
}

class WpObject {
    constructor(self, parent, schema, state) {
        this.state = state;
        this.endpoint = self ? parent + '/' + self : parent;
        console.log("constructing WpObject: ", this.endpoint)
        
        let isModelRegex = (str) => {
            try{
                return new RegExp(str).test(99999) || new RegExp(str).test('fws3y3mlpz') 
            } catch(e) {
                // sadly all the regexes throw exception :D go and get a good laugh.
                return true;
            }
        }
        if(parent == '/wp/v2/posts')
            console.log("parent: ", parent)
        let collections = schema.filter(e => {
            let s = e.replace(this.endpoint+'/', '').split('/')
            return s.length == 2 && isModelRegex(s[1])
        }).map(s => {
            let e = s.split('/');
            return e[e.length-2];
        });        

        if(parent == '/wp/v2/posts')
            console.log("parent coll: ", collections)
        // collections are not constructed immediately, but when they are called.
        collections.forEach(c => this[c] = (args) => new WpCollection(c + this._serialize(args), this.endpoint, schema) )
        
        let imm = schema.filter(e => e.indexOf(parent) !== -1 && e.replace(parent + '/', '').indexOf('/') == -1)
                        .map(d => d.replace(parent+'/', ''))
        let models = imm.filter(e => e.match(/^[0-9a-z]+$/)  && collections.indexOf(e) == -1 && self !== e)
        
        // models are constructed immediately
        models.forEach(m => {
            this[m] = new WpObject(m, this.endpoint, schema)
        })
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
    fetch(args) { return this.get(args) }
    get(args) {
        return $ajax.get(this.endpoint + this._serialize(args)).then(
            success => {
                this.state = success;
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
            throw 'The property "' + prop + '" does not exist on the endpoint: ' + this.endpoint
        
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
    save(model) { return this.post(model)}
    post(model) {
        let payload = model ? model : this.state;
        return $ajax.post(this.endpoint, payload).then(
            newState => {
                this.state = newState;
                return this;
            }
        )
    } 
}

/**
 * An array of WpObjects
 */
class WpCollection extends Array {
    constructor(self, parent, schema) {
        super();
        this.endpoint = parent + '/' + self;
        console.log("constructing WpCollection: ", this.endpoint)

        //* wp.posts().id(2)       // returns a rest object with this id.
        this.id = (postId) => {
            let res = this.find(o => o.id == postId);
            if(res == null) {            
                res = new WpObject(postId, this.endpoint, schema);
                this.push(res);
            }
            return res; 
        }

        // wp.posts().get()       // returns a promise to get the posts, using default params
        this.get = () => {
            // process args and append to route        
            return $ajax.get(this.endpoint).then(
                posts => {
                    posts.forEach(o => {
                        this.push(new WpObject(o.id, this.endpoint, schema, o))
                    });
                    return this;
                }
            )
        }

        //* wp.posts().add({title: 'hello world'}) // creates local model of post and returns it
        this.add = (args) => { // what if object with id already exists in collection
            return args.id ? this.id(args.id): new WpObject("", this.endpoint, schema, args);
        } 
        
        this.state = () => {
            return this.map(o => o.state);
        }
    }
}