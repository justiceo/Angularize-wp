/**
 * Directive that takes a user id and displays a popover of the user's info on hover
 */
export class AuthorPopoverCtrl {
    // ui-bootstrap already has a popover that works well,
    // - install ui-bootstrap
    // - create the author popover template
    // - add the hover trigger

}

let AuthorPopover = {
    //restrict: 'A',
    controller: AuthorPopoverCtrl,
    template: `<p>author info here</p>`
}

export default AuthorPopover;