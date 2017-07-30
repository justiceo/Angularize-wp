# Angularize Rest API

Angularize ships with a `RestApi` service that serves as a drop-in replacement for the WP-REST-API-v2 Backbone.js client.
Like backbone, The  provides an interface for the WP REST API by providing Angularize Models and Collections for all endpoints exposed by the API Schema.

# Using
Below is a component using the `RestApi` service to fetch the 5 most recent posts 

```
<script type="text/javascript" defer data-manual>
  document.addEventListener("DOMContentLoaded", function() {
    angularize.component("Recent5", {
      template: 'Hello World!',
      controller: function(RestApi) {
        RestApi.ready().then(
            () => {
                this.posts = RestApi.$wp_v2.posts({'per_page': 5})
                this.posts.get();
            }
        )
      }
    })
  });
</script>
```

# Structure
All endpoints exposed by the API schema is either a model or a collection.
The models are represented by an instance of `WpObject` while the collections are `WpCollection`.
The RestApi starts with a namespace (default: `/wp/v2/`) and builds a tree representing the endpoints.

```

            ,------> [C] posts/ ---------> #id/ -----> revisions/ -----> #revId/
            |
            |
            |-------> [C] tags/ ---------> #id/ 
            |
            |
[N/O] wp/v2/|-------> [C] users/ --------> #id
            |                    `-------> me
            |
            |-------> [C] categories/ ---> #id
            |
            |
            `-------> [C] pages/ --------> #id -----> revisions/ -----> #revId/
```
[N] - namespace
[O] - WpOjbect
[C] - WpCollection

Use cases
---------
To get the posts:
`http://example.com/wp-json/wp/v2/posts`
In RestApi would be:
`var posts = RestApi.$wp_v2.posts() # creates the collection model`
`posts.get() # issue a GET request to fetch data and populate underlying model` 

Or

```
RestApi.$wp_v2.posts().get().then(
  posts => { 
    // use it here
  }
)
```

To get the first 3 results of posts matching a string
`http://example.com/wp-json/wp/v2/posts/?per_page=3&search="query"`
In RestApi would be:
`var posts = RestApi.$wp_v2.posts({per_page:3, search:'query'})`
`posts.get()`

To get the post whose ID is 3
`http://example.com/wp-json/wp/v2/posts/3`
In RestApi would be:
`var post = RestApi.$wp_v2.posts().id(3)`
`post.get()`

To get the post whose ID is 3 and embed author and media information
`http://example.com/wp-json/wp/v2/posts/3?embed=true`
In RestApi would be:
`var post = RestApi.$wp_v2.posts().id(3)`
`post.get({embed:true})`

To create a new post
`[POST] http://example.com/wp-json/wp/v2/posts/?title=hello&content=text`
In RestApi would be:
```
var wpPost = RestApi.$wp_v2.posts().add({title: 'hello': content:'text'}) # create WpObject for posts
wpPost.post() # issue a POST request to save the new model
```

The endpoint of a WpObject or WpCollection is exposed via an `endpoint` property
```
var post = RestApi.$wp_v2.posts().id(3)
console.log(post.endpoint) # prints http://example.com/wp-json/wp/v2/posts/3\
```

The properties of a model can be accessed via the attr() function exposed by the WpObject
```
RestApi.$wp_v2.posts().id(3).get().then(
  post => console.log(post.attr('title')) # prints the title of the post with ID 3
)
```

How would you get the revisions for the post with ID 3?
`RestApi.$wp_v2.posts().id(3).revisions().get()`
To get the revision whose ID is 19 on the post with ID 3, would be:
`RestApi.$wp_v2.posts().id(3).revisions().id(19).get()`


Peeking into Backbonejs (v2 goals)
----------------------------------
API Integration

Backbone is pre-configured to sync with a RESTful API. Simply create a new Collection with the url of your resource endpoint:
```
var Books = Backbone.Collection.extend({
  url: '/books'
});
```

The Collection and Model components together form a direct mapping of REST resources using the following methods:
```
GET  /books/ .... collection.fetch();
POST /books/ .... collection.create();
GET  /books/1 ... model.fetch();
PUT  /books/1 ... model.save();
DEL  /books/1 ... model.destroy();
```

When fetching raw JSON data from an API, a Collection will automatically populate itself with data formatted as an array, while a Model will automatically populate itself with data formatted as an object:
```
[{"id": 1}] ..... populates a Collection with one model.
{"id": 1} ....... populates a Model with one attribute.
```

However, it's fairly common to encounter APIs that return data in a different format than what Backbone expects. For example, consider fetching a Collection from an API that returns the real data array wrapped in metadata:
```
{
  "page": 1,
  "limit": 10,
  "total": 2,
  "books": [
    {"id": 1, "title": "Pride and Prejudice"},
    {"id": 4, "title": "The Great Gatsby"}
  ]
}
```

In the above example data, a Collection should populate using the "books" array rather than the root object structure. This difference is easily reconciled using a parse method that returns (or transforms) the desired portion of API data:
```
var Books = Backbone.Collection.extend({
  url: '/books',
  parse: function(data) {
    return data.books;
  }
});
```

Model
-----
- get - model.get(attribute)
Get the current value of an attribute from the model. For example: `post.get('link')`

- set - model.set(attribute, value), model.set(attributes):
For example: 
```
post.set('title', 'hello world')
post.set({'title': 'hello world', 'content': 'post content'})

- escape - model.escape(attribute): Similar to [get], but returns the HTML-escaped rendered-version of a model's attribute. For example:
```
post.get('title') // { rendered: '<h2>Hello world</h2>'}
post.escape('title') // 'hello world'

- has - model.has(attribute): Returns true if the attribute is set to a non-null or non-undefined value.

- id - model.id: A special property of models, the id is an arbitrary string (integer id or UUID). If you set the id in the attributes hash, it will be copied onto the model as a direct property. Models can be retrieved by id from collections, and the id is used to generate model URLs by default.

- cid - model.cid: A special property of models, the cid or client id is a unique identifier automatically assigned to all models when they're first created. Client ids are handy when the model has not yet been saved to the server, and does not yet have its eventual true id, but already needs to be visible in the UI.


- changed - model.changed : The changed property is the internal hash containing all the attributes that have changed since its last set. Please do not update changed directly since its state is internally maintained by set. A copy of changed can be acquired from changedAttributes.

- fetch - model.fetch([options]): Merges the model's state with attributes fetched from the server by delegating to Backbone.sync. Returns a jqXHR. Useful if the model has never been populated with data, or if you'd like to ensure that you have the latest server state. Triggers a "change" event if the server's state differs from the current attributes. fetch accepts success and error callbacks in the options hash, which are both passed (model, response, options) as arguments.

- save - model.save([attributes], [options]): READ ON SERVER
- destroy - model.destroy([options]): Destroys the model on the server by delegating an HTTP DELETE request to 