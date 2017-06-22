# Angularize WordPress

Super-charge your WordPress site with AngularJs components. Even though this can be used to load the entire WordPress site, it more useful for loading non-critical parts of a site (for SEO reasons). 

For example, loading all sidebar widgets, banners and sliders, ads, forms etc. 

### Hello World component
Below is a complete (with script tag) example of an angular component in a WordPress site.
```
<script type="text/javascript">
  document.addEventListener("DOMContentLoaded", function(event) {
    angular.module("app").component("echo", {
      template: 'Hello World!',
      controller: function() {}
    })
  });
</script>
```
Now, anywhere you enter the tag `<echo></echo>` in your WordPress site (posts, pages, widgets etc), you will get the text *Hello World!*


### Angular Workflow
* Heavily commented webpack configuration with reasonable defaults.
* ES6, and ES7 support with babel.
* Source maps included in all builds.
* Development server with live reload.
* Production builds with cache busting.
* Testing environment using karma to run tests and jasmine as the framework.
* Code coverage when tests are run.
* No gulp and no grunt, just npm scripts.

>Warning: Make sure you're using the latest version of Node.js and NPM

### Quick start

> Clone/Download the repo then edit `app.js` inside [`/src/app/app.js`](/src/app/app.js)

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

go to [http://localhost:8080](http://localhost:8080) in your browser.

# Table of Contents

* [Getting Started](#getting-started)
    * [Dependencies](#dependencies)
    * [Installing](#installing)
    * [Running the app](#running-the-app)
    * [Developing](#developing)
    * [Testing](#testing)
* [License](#license)

# Getting Started

## Dependencies

What you need to run this app:
* `node` and `npm` (Use [NVM](https://github.com/creationix/nvm))
* Ensure you're running Node (`v4.1.x`+) and NPM (`2.14.x`+)
* Ensure webpack is installed globally or install by running `npm i -g webpack`

## Installing

* `fork` this repo
* `clone` your fork
* `npm install` to install all dependencies

## Running the app

After you have installed all dependencies you can now run the app with:
```bash
npm start
```
It will start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://localhost:8080`.

Alternatively, you can generate the plugin files with:
```bash
webpack
```

## Developing

### Build files

* single run: `npm run build`
* build files and watch: `npm start`

## Testing

#### 1. Unit Tests

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

##### Release 1.0.0-beta.3
- move extra components to a common module
- complete book-flight component
- complete author-popover component
- remove <app> component and tests
- add test for <recent-post> component
- thin down demo.css to the basics
- make prismjs work smoothly on live reload
- ensure demo.css isn't overriding import angluar-material styles

##### Why not use Angular Material
- Js needs to be parsed before any html can render
- It is very heavy and bloated, 10X bootstrap
- We'll still need bootstrap for some other tasks
- The CSS benefits can be derived from a customized boostrap css like Bootswatch paper
- It breaks CSS of other components - like editor, and can alter style of website it's used on.


##### Things we stand to loose
- Easy components like chips, modals and buttons
- Cool animations and ripples
- Too much leg work at the start.
- Pre-mature optimization  means we'll never get there


### Keep Writing Editor out of this eventually
### Add all wp widgets as components
### Consume the headers:
X-WP-Total: the total number of records in the collection
X-WP-TotalPages: the total number of pages encompassing all available records
### Switch out PostService for Backbone js client.
- add backwards support for front-end editor - editor
- remove editor module


- separate postSettings from postSettingsToolbar
- where toolbar is reponsible for registering buttons and launching modal
- add string binding on book flight
- add is_single, is_archive to angularize_server, let toolbars choose post types to display one