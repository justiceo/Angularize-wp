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
           $wp_v2 => {
                this.user = $wp_v2.users().id('me')
                this.user.get(),
                
                this.posts = $wp_v2.posts({ author: RestApi.$server.currentUser.ID })
                this.posts.get()
            }
        )
    }

}

let AuthorPopover = {
    //restrict: 'A',
    controller: AuthorPopoverCtrl,
    template: `
    
    <div class="card" style="width: 20rem;">
    <div class="card-block">
       
      <a href="{{ $ctrl.user.attr('link') }}"><img src="{{ $ctrl.user.attr('avatar_urls')['24'] }}" style="height: 48px; width: 48px; border-radius: 50%; display: inline-block; float:right;"></a>
      
  <a href="{{ $ctrl.user.attr('link') }}"><h4 class="card-title" style="padding: 0;">{{ $ctrl.user.attr('name') }}</h4></a>
    <p class="card-text" style="font-size: 12px; padding-bottom:8px; border-bottom: 1px solid #f2f2f2;line-height: 14px;">{{ $ctrl.user.attr('description') }}</p>
      
      <h6 class="card-subtitle mb-2 text-muted" style="font-size: 12px;">MY STORIES</h6>
      
      <div class="list-group">
                <a href="{{ post.attr('link') }}" class="list-group-item" ng-repeat="post in $ctrl.posts">
                    <span class="badge">{{ post.attr('date') | timesince }} ago</span>
                    {{ post.attr('title') }}            
                </a>
            </div>
    
  </div>
</div>
    `
}

export default AuthorPopover;