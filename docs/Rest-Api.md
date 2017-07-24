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
            $wp_v2 => {
                this.posts = $wp_v2.posts({'per_page': 5})
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
[O] wp/v2/  |-------> [C] users/ --------> #id
            |                    `-------> me
            |
            |-------> [C] categories/ ---> #id
            |
            |
            `-------> [C] pages/ --------> #id -----> revisions/ -----> #revId/
```