
export class NewPostCtrl {
    constructor($scope, $mdDialog, $log, ToolbarService, PostService) {
        angular.extend(this, {
            '$scope': $scope, 'ToolbarService': ToolbarService,
            'PostService': PostService, '$mdDialog': $mdDialog, '$log': $log
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
        this.$mdDialog.show({
            template: require('./new-post.html'),
            scope: this.$scope,
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
    template: require('./new-post.html')
}

export default NewPost;