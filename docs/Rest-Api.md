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
