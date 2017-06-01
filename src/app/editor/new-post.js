
export class NewPostCtrl {
    constructor($scope, $mdDialog, ToolbarService, PostService) {
        angular.extend(this, {
            '$scope': $scope, 'ToolbarService': ToolbarService,
            'PostService': PostService
        });

        $log.log("NewPost: Initializing...")
        let button = {
            id: 'le_new_post',
            title: 'New Post',
            icon: 'icon-pencil',
            position: 2,
            handler: () => this.newPostHandler()
        };
        ToolbarService.add(button);


        $scope.cancel = function () {
            $mdDialog.hide();
        }

        $scope.create = function (title) {
            console.log("EDITOR: creating post title");
            if (!title) return;
        }

    }

    newPostHandler() {
        $mdDialog.show({
            templateUrl: 'new-post/new-post.html',
            scope: $scope,
            preserveScope: true,
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            openFrom: '#le_toolbar',
            closeTo: '#le_toolbar',
            fullscreen: true // Only for -xs, -sm breakpoints.
        });
    }


}

let NewPost = {
    controller: NewPostCtrl,
    template: `
<div ng-cloak="" layout="column">
    <md-toolbar class="md-accent _md _md-toolbar-transitions">
        <div class="md-toolbar-tools">
            <h2 flex md-truncate>Create a New post</h2>
            <md-button class="md-icon-button" ng-click="cancel()">
                <md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog" />
            </md-button>
        </div>
    </md-toolbar>
    <md-content layout-gt-sm="column" layout-padding>
        <div layout="column" style="min-width:600px">
            <md-input-container>
                <label>Post Title</label>
                <input ng-model="postTitle">
            </md-input-container>
        </div>
        <div layout="row" layout-align="end end">
            <!--<md-button class="md-raised">More Options</md-button>-->
            <md-button class="md-raised md-primary" ng-click="create(postTitle)">Create Post</md-button>
        </div>
    </md-content>
</div>
    `
}

export default NewPost;