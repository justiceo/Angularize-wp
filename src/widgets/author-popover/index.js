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
            user => {
                this.user = $wp_v2.users(RestApi.$server.users().ID)
                this.user.get()    
            }
        )
    }

}

let AuthorPopover = {
    //restrict: 'A',
    controller: AuthorPopoverCtrl,
    template: './author-popover.html'
}

export default AuthorPopover;