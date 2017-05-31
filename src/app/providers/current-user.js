/**
 * Current Logged In User object
 * 
 */
export default class CurrentUser {
    constructor($window, $log, $q, Ajax) {
        $log.info('CurrentUser: Initializing...')
        this.Ajax = Ajax;
        this.$q = $q;
        this.$wp = $window.wp_rest_object || {};
        this.$wp.user = this.$wp.currentUser || {};
        this.$wp.user.meta = this.$wp.user.meta || {};
        let userInfo = this.$wp.user.data || {};
        angular.extend(this.$wp.user, {
            'ID': this.$wp.user.ID, // only return the ID, fetch the rest via ajax please
            'display_name': userInfo.display_name,
            'email': userInfo.user_email,
            'login': userInfo.user_login,
            'nicename': userInfo.user_nicename,
            'registered_date': userInfo.user_registered,
            'status': userInfo.user_status
        });   
        //this.fetchUserInfo();
        $log.debug("CurrentUser: $wp.user ", this.$wp.user);
    }

    // For full list of capabilities see https://codex.wordpress.org/Roles_and_Capabilities
    hasCapability(cap) {
        if(!this.$wp.user.allcaps) 
            return false;
        return this.$wp.user.allcaps[cap] === true;
    }

    // For full list of roles see https://codex.wordpress.org/Roles_and_Capabilities
    hasRole(role) {
        if(!this.$wp.user.roles) 
            return false;
        return this.$wp.user.roles.contain(role)
    }

    fetchUserInfo() {
        this.Ajax.get(this.Ajax.restRoute + '/users/' + this.$wp.user.ID).then(
            response => {
                console.log("user: ", response.data);
                angular.extend(this.$wp.user, response.data);
            }
        )
    }

    getMeta(key) {
        return this.$q.resolve(this.$wp.user.meta[key]);
    }
}