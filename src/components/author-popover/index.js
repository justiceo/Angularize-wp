/**
 * Directive that takes a user id and displays a popover of the user's info on hover
 */
export class AuthorPopoverCtrl {
    // ui-bootstrap already has a popover that works well,
    // - install ui-bootstrap
    // - create the author popover template
    // - add the hover trigger
    constructor(RestApi){
        /*RestApi.ready().then(
            user => {
                this.user = $wp_v2.users(RestApi.$server.users().ID)
                this.user.get()    
            }
        )*/
    }

}

let AuthorPopover = {
    //restrict: 'A',
    controller: AuthorPopoverCtrl,
    template: `
    
    <div class="a-popover">
  <div class="author-avatar">
    <a href="#"><img src="https://dev.kasomafrica.com/wp-content/plugins/ultimate-member/assets/img/default_avatar.jpg"></a>
  </div>
  <span class="a-name"><h3><a href="#">John Doe</a></h3></span>
    <span class="bio"><p>All round cool guy</p></span>
    
     <div class="a-stories">
    <h5>MY STORIES</h5>
      <ul>
        <li><a href="#">Jollof Wars: Why Ghana Keeps Winning</a></li>
        <li><a href="#">The Rise and Fall of Idi Amin</a></li>
        <li><a href="#">My Dream African Tour</a></li>
    </ul>
    
  </div>
  
  <div class="a-connect">
    <ul>
      <li><a href="#" data-tooltip="Follow"><i class="fa fa-user-plus"></i></a></li>
      <li><a href="#" data-tooltip="Send message"><i class="fa fa-envelope"></i></a></li>
 </ul>
  </div>

  <style scoped>
      .a-popover{
  border-bottom: 1px solid #ffcc00;
  width: 23%;
  border: 1px solid #f3f3f3;
  padding: 9px;
  box-shadow: 0 0 5px #ddd;
  overflow: hidden;
}

.author-avatar{
  float: right;
  padding-top: 9px;
}

.author-avatar img{
  height: 48px;
  width: 48px;
  overflow: hidden;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
}

.a-name h3{
  display: inline-block;
}

.a-name h3 a{
  text-decoration: none;
  color: #000;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, sans-serif;
}

.bio p{
  margin-top: -15px;
  font-family: "Big Caslon", "Book Antiqua", "Palatino Linotype", Georgia, serif;
  font-size: 13.5px;
  color: #808080;
}

.a-stories{
  border-bottom: 1px solid #ffcc00;
  border-top: 1px solid #ffcc00;
}

.a-stories a{
  text-decoration: none;
  color: #000;
  font-size: 13px;
  font-family: Geneva, Tahoma, Verdana, sans-serif;
}

.a-stories ul{
  padding-left: 15px;
  margin-top: -15px;
}

.a-connect ul{
  list-style: none;
  text-decoration: none;
  padding-left: 5px;
  float: left;
 }

.a-connect ul li a i{
  color: #000;
  text-decoration: none;
  padding-right: 5px;
 }

.a-connect li{
  display: inline-block;
 }

h5{
  font-family: "Big Caslon", "Book Antiqua", "Palatino Linotype", Georgia, serif;
}
</style>

    `
}

export default AuthorPopover;