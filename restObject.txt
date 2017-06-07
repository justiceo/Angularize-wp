- there are two basic data types in the schema of discovery, object or array
- if array, should be indexable like a native array.
- if object, should have a "get" method that can be used to fetch further endpoints from the object.
- if object, properties can be fetched like any js object
- when a resource is requested, if it is available, it is returned, else the url to its location is returned.
- get() takes the url and fetches it, caches the result appropriately, 
- hence only get() returns a promise, should it cache? where does caching happen?,
- let fetch do the caching, so only url endpoints are cached.
- refresh() is similar to fetch, but does not use the use cache, in fact, it overwrites cache data with fresh content.

/wp/v2/posts/
wp.$('v2').$('posts').get(); // fetches the object.
wp....val(); // returns the object
wp....valOrGet(); // returns the reference, fetches and updates the reference.

/wp/v2/posts/2
wp.$('v2').$('posts').at(2).get();
wp.v2.getPosts()[2].get();

/wp/v2/posts/2/revisions
wp.$('v2').$('posts').at(2).$('revisions').get();

// when you're sure the revisions data above has been loaded, easy access
wp.v2.posts[2].revisions

wp.$('v2') // returns { url->appendToSelf, getFn->self, fetFn-> loads url and caches } 

// to add a post revisions
wp.$('v2').$('posts').at(2).$('revisions').post({id: 2, title: "stuff});

// to pass arguments to an endpoint
wp.$('v2').$('posts', {'per_page': 5}).get();
// if posts, is already loaded, should return top 5, not issue a request.

// or create a model like below
{
    wp:v2: {
        posts: [
            obj: {

            }
        ],
        pages: [

        ]
    }
}
// or read the schema and create an object that looks like
{
    wp.api: {
        models: [
            Post: {
            },
            PostRevision: {

            }
        ],
        collections: [
            Posts: [

            ]
        ]
    }
}
class RestObject {

    url = "";
    val = null;

    $(route) {
        // check if route is valid from this endpoint 

        // update endpoint 
        url += route;

        return this;
    }

    at(index) {
        // fetch 

    }
    
    // similar to at in behavior, returns the post if exist or url to it.
    id(postId) { // this must be a collection type.
        // check this.val for post with id
        val post = this.val.find(postId);
        if(!post) {
            this.url += postId;
            this.val.postId = null;
            this.val = this.val.postId;
            return this;
        }
        return post;
    }

    val() {
        return this.val;
    }

    get(endpoint, args = {}) {        
        this[endpoint] = new RestObject(result);
        this = this[endpoint];
        return this;
    }

    post(endpoint, payload) {

    }
    
    asPostType() {
        // converts ids to corresponding objects.
    }
}

