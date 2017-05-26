export default class PostService {
    constructor($window, $http, $q, $log, Cache) {
        'ngInject';        
        angular.extend(this, {'$window': $window, '$http': $http, '$q': $q, '$log': $log, 'Cache': Cache});
        this.$wp = $window.wp_rest_object;
        console.log("$wp", this.$wp);
    }

    the_ID() { return "12345"}
    the_post() {}
    the_excerpt() {}
    the_title() {}
    the_author() {}
    the_content() {}
    the_tags() {}
    the_category() {}
    the_permalink() {}

    is_sticky() {}
    is_single() {}
    has_excerpt() {}
    has_tag() {}
    has_thumbnail() {}
    has_post_format() {}
}