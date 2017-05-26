angular.module('app')
    .factory('PostService', ['$http', '$log', function($http, $log) {
        var post = {};

        post.the_ID = postObject.ID;
        

        post.the_excerpt = postObject.excerpt;
        post.get_the_excerpt = function(id) {

        }

        post.the_permalink = postObject ? postObject.permlink : null;
        post.get_permalink = function(id) {}

        return post;
    }])