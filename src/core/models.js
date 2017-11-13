if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      return this.substr(position || 0, searchString.length) === searchString;
  };
}

if (!String.prototype.endsWith)
String.prototype.endsWith = function(searchStr, Position) {
    // This works much better than >= because
    // it compensates for NaN:
    if (!(Position < this.length))
      Position = this.length;
    else
      Position |= 0; // round position
    return this.substr(Position - searchStr.length,
                       searchStr.length) === searchStr;
};

export default class Models {

    getSchema(routes) {
        if (!routes) {
            return [];
        }
        if (routes.constructor !== Array) {
            throw 'getSchema: routes param should be array of strings. Got ' + routes;
        }
        
        let models = [];
        routes.forEach(route => {
            models.push(this.objectFromUrl(route));
        });
        return models;
    }

    /**
     * 
     * @param {*} url 
    '/wp/v2',
    '/wp/v2/posts' -> Posts
    '/wp/v2/posts/(?P<id>[\d]+)' -> Post
    '/wp/v2/posts/(?P<parent>[\d]+)/revisions -> PostRevisions
    '/wp/v2/posts/(?P<parent>[\d]+)/revisions/(?P<id>[\d]+)' -> PostRevision
    '/wc/v2/products/categories -> ProductCategories

     */
    objectFromUrl(url) {
        if (typeof url !== 'string') {
            throw 'objectFromUrl: url should be string. Got ' + typeof url;
        }

        const _url = url.startsWith('/') ? url.slice(1) : url;
        let segments = _url.split('/');
        if (segments.length < 2) {
            throw 'objectFromUrl: url segment must have at least a namespace and a version. Got ' + url;
        }
        const namespace = segments.shift();
        const version = segments.shift();
        let isModel = (seg) => seg === '(?P<id>[\d]+)' || seg === '(?P<parent>[\d]+)';        
        let name = '';
        let type = '';
        while(segments.length > 0) {
            const last = segments.pop();
            if (isModel(last)) {
                if(!type) {
                    type = 'model';
                }
                let collection = segments.pop();
                name = this.capitalize(this.singularize(collection)) + name;
            }
            else {                    
                name = this.capitalize(name ? this.singularize(last) : last) + name;               

                if(!type) {   
                    type = 'arbitrary';                    
                }             
            }
        }

        return {'ns': namespace, 'url': url, 'name': name, 'type': type, 'version': version}
    }
    
    // takes a word and repeatedly tries all the plural->singular rules until match is found,
    // otherwise returns original word
    // see https://en.oxforddictionaries.com/spelling/plurals-of-nouns for more information on plural formation
    singularize(word) {
        if (typeof word !== 'string') {
            throw 'singularize: expected a string, got: ' + word
        }
        if (word.endsWith('ies')) {
            return word.slice(0, word.length-3) + 'y';
        }
        if (word.endsWith('ves')) {
            return word.slice(0, word.length-3) + 'f'; // f as in half or fe as in knife
        }
        if (word.endsWith('es')) {
            return word.slice(0, word.length-2);
        }
        if (word.endsWith('s')) {
            return word.slice(0, word.length-1);
        }
        return word;
    }

    capitalize(word) {
        if (typeof word !== 'string') {
            throw 'capitalize: expected a string, got: ' + word
        }        
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    
}