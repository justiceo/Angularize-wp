
export class RestObject {
    model;
    childRefs;
    root;
    isCollection;

    constructor( endpoint = "wp-json/wp/v2", Schema) {
        

        // anything that is not verifyably a collection
        schema.getModels(endpoint).foreach(m => {
            let mE = endpoint + "/" + m;
            childRefs[mE] = new RestObject(mE);
        });

        schema.getCollections(endpoint).foreach(e => {
            let childE = endpoint + "/" + e;
            childRefs[childE] = new RestObject(childE);
        });        
    }

    $(route) {}
    at(index) {}
    id(postId) {}
    val() {}
    get(endpoint, args = {}) {
        // endpoint must exist in childRef keys to be valid
        // update the child ref
        this[endpoint] = new RestObject("url", "", "");
        return this[endpoint];
    }
    post(endpoint, payload) {}
    asPostType() {}
}

export class Schema {
    // fetch the json root
    // create the object and print it to console
    
    constructor($http) {
        $http.get("http://snow.2rof.com/wp-json/wp/v2/").then(
            success => {
                console.log(success.data);
                this.schema = success.data;
            }
        )
    }

    getModels(endpoint) {
        let routes = Object.keys(this.schema.routes);
        routes = routes.filter(r => r.startsWith(endpoint));
        routes = routes.map(r => endpoint + r.substring(endpoint.length. r.indexOf('/')));
        return routes;
    }

    getCollections(endpoint) {
        
    }
    
}