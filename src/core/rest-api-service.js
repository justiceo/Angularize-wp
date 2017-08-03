import AjaxService from './ajax-service';
var $ajax = null; // make ajax available for WpObject & WpCollection

/** 
 * since there's the backbone js client exists and is quite attractive,
 * focus on making this one particularly simple for the most common use case - 'post'
 * and plugins 
 * make two-way binding a breeze
 * using $scope.$apply() anywhere means we're doing something wrong.
 */
export default class RestApiService {
    constructor($http, $q) {        
        $ajax = new AjaxService($http, $q);
        this.$server = window.angularize_server;
        this.ready = (namespace = '/wp/v2') => { 
            return $ajax.get(namespace).then(
                schema => {
                    let namespace_label =  '$' + namespace.replace(/\/$/, "").replace(/^\/+/g, '').replace('/','_');
                    if(this[namespace_label]) return this[namespace_label];

                    const routesSchema = Object.keys(schema.routes).map(r => r.replace("parent", "id"));//.replace(namespace + '/', ''));
                    //console.group("building ", namespace)
                    this[namespace_label] = new WpObject('', namespace, routesSchema)
                    //console.groupEnd();
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
        //console.log("constructing WpObject: ", this.endpoint)
        
        let isModelRegex = (str) => {
            try{
                return new RegExp(str).test(99999) || new RegExp(str).test('fws3y3mlpz') 
            } catch(e) {
                // sadly all the regexes throw exception :D go and get a good laugh.
                return true;
            }
        }
        //if(parent == '/wp/v2/posts')
            //console.log("parent: ", parent)
        let collections = schema.filter(e => {
            let s = e.replace(parent+'/', '').split('/')
            return s.length == 2 && isModelRegex(s[1])
        }).map(s => {
            let e = s.split('/');
            return e[e.length-2];
        });        

        //if(parent == '/wp/v2/posts')
            //console.log("parent coll: ", collections)
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
                    //console.log("get args: ", success);
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

    getMeta(prop) {
        prop = 'angularize_' + prop;
        if( !(prop in this.state.meta) )
            throw 'The property "' + prop + '" is not a meta on the endpoint: ' + this.endpoint

        return this.state.meta[prop];
    }

    setMeta(prop, value) {
        prop = 'angularize_' + prop;
        this.state.meta[prop] = value;
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
        //console.log("constructing WpCollection: ", this.endpoint)

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

/**
 * v2 goals
 * --------
 * There is the issue of nested collections
 * Irregular location of objects and collections etc
 * Imagine we only have a tree of WpObjects
 * and WpCollection are basically objects whose state in an array.
 * In this case, the api doesn't know or try to predict what type the data is, until it has fetched it.
 * Then we can have $wp_v2.posts.fetch({per_page:5}) // to get posts * 
 * and $wp_v2.posts.save({title: test}) // to save new post
 * and $wp_v2.posts.id(2).fetch({embed:2})
 * and $wp_v2.posts.id(2).save({title: test}) // to update current post
 * and $wp_v2.posts.id(2).revisions.fetch() // to get post revisions
 * 
 * fix the problem of non-conformant collections
 * fix the problem of strange models like files and login/logout
 * add events
 */