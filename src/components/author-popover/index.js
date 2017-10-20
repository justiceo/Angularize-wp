/**
 * Directive that takes a user id and displays a popover of the user's info on hover
 */
export class AuthorPopoverCtrl {
    // ui-bootstrap already has a popover that works well,
    // - install ui-bootstrap
    // - create the author popover template
    // - add the hover trigger
    constructor(RestApi){
        RestApi.ready().then(
            () => {
                this.user = RestApi.$wp_v2.users().id("me");
                this.user.get()    
            }
        )
    }

}

let AuthorPopover = {
    //restrict: 'A',
    controller: AuthorPopoverCtrl,
    template: `<p>author popover`    
}

export default AuthorPopover;