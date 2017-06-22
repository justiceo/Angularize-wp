/**
 * PostService
 * contains information about the current post (could be page, attachement etc)
 */
import RestApi from './rest-api';

export default class PostService {
    constructor($window, $q, $log, Ajax) {
        $log.info("PostService: Initializing...");
        angular.extend(this, {'$window': $window, '$q': $q, '$log': $log, 'Ajax': Ajax});
        this.$wp = $window.angularize_server || {};
        this.post = this.$wp.postObject || {};
        this.postRoute = Ajax.restRoute + "/posts";        
    }

    ready() {
        let initPromise = new RestApi(this.$window, this.Ajax);
        return initPromise.then(
            restApi => this.$restApi = restApi
        )
    }    
}
