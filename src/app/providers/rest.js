angular.module('app')
    .factory('RestService', ['$http', '$log', function($http, $log) {
        var rest, post, categories, tags, pages, meta = {};


        rest.thePost = function(){}
        rest.getPosts = function(){}
        rest.getAuthors = function(){}

        return rest;
    }])