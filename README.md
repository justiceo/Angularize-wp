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
- for new-post element, we're not using a modal
- on new-post page, display a loading sign while component loads

- Angularize should have an auth endpoint for /login register/ and logout/ - depends on WpObject not collection error above
- Revisions doesn't work
- Settings object works but have WpCollections