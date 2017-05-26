/**
 * Ajax
 * provides wrapper for ajax calls to service,
 * with caching to reduce hits
 */
export default class Ajax {
    constructor($window, $http, $q, $log, Cache) {
        'ngInject';
        angular.extend(this, {'$window': $window, '$http': $http, '$q': $q, '$log': $log, 'Cache': Cache});
        this.$wp = $window.wp_rest_object;
    }

    get(url) { }
    
    // short-hands
    get_post(postId) { }
}