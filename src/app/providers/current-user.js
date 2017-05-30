/**
 * Current Logged In User object
 * 
 */
export default class CurrentUser {
    constructor($window, Ajax) {
        this.user = $window.wp_rest_object || {}
        let userInfo = this.user.data || {};   
        angular.extend(this.user, {
            'ID': this.user.ID, // only return the ID, fetch the rest via ajax please
            'display_name': userInfo.display_name,
            'email': userInfo.user_email,
            'username': userInfo.user_login,
            'nicename': userInfo.user_nicename,
            'registered_date': userInfo.user_registered,
            'status': userInfo.user_status
        });   
        this.fetchUserInfo();
    }

    // For full list of capabilities see https://codex.wordpress.org/Roles_and_Capabilities
    hasCapability(cap) {
        if(!this.user.allcaps) 
            return false;
        return this.user.allcaps[cap] === true;
    }

    // For full list of roles see https://codex.wordpress.org/Roles_and_Capabilities
    hasRole(role) {
        if(!this.user.roles) 
            return false;
        return this.user.roles.contain(role)
    }

    fetchUserInfo() {
        this.Ajax.get(this.Ajax.restRoute + '/users/' + this.user.ID).then(
            response => {
                console.log("user: ", response.data);
                angular.extend(this.user, response.data);
            }
        )
    }

    getMeta(key) {
        return this.user.meta[key];
    }
}