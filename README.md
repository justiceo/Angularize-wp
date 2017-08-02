# Angularize WordPress

Super-charge your WordPress site with AngularJs components. 
For example, loading all sidebar widgets, banners and sliders, ads, forms etc. 

### Hello World component
Below is a complete (with script tag) example of an angular component in a WordPress site.
```
<script type="text/javascript">
  document.addEventListener("DOMContentLoaded", function(event) {
    angularize.component("echo", {
      template: 'Hello World!',
      controller: function() {}
    })
  });
</script>
```
Now, anywhere you enter the tag `<echo></echo>` in your WordPress site (posts, pages, widgets etc), you will get the text *Hello World!*

##### Stack
AngularJs, ES6, Babel + Browserfiy, Gulp, Karma + Jasmine

### Quick start

```bash
# clone the repo
$ git clone https://github.com/justiceo/angularize

# change directory to your app
$ cd angularize

# install the dependencies with npm
$ npm install

# Ignore updates to app.templates.js
$ git update-index --assume-unchanged src/core/app.templates.js

# start the server
$ npm start
```

go to [http://localhost:3000](http://localhost:3000) in your browser.


### Developing

* single run: `npm run build`
* build files and watch: `npm start`

### Testing

* single run: `npm test`
* live mode (TDD style): `npm run test-watch`

### Plugins that Interfer with Rest Api
* Wordfence security: the most popular security plugin on wordpress. 
  - When enabled, some requests incorrectly return a 404
  - An example request would be localhost/wp-json/wp/v2/posts/?author=1


# License

[MIT](/LICENSE)


#### Release 1.0.0 Goals
- working documentation
- working demo
- optional inclusion of extra components
- optional inclusion of extra modules
- working tests

todo
====
- on new-post page, display a loading sign while component loads
- create a build-from-dashboard solution for this project
- Angularize should have an auth endpoint for /login register/ and logout/ - depends on WpObject not collection error above
- Revisions doesn't work
- Settings object works but have WpCollections
- Issue a warning when WordFence is installed