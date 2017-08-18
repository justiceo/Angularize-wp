
export class ToolbarCtrl {
    constructor($rootScope, $compile, $window, $uibModal, ToolbarService) {
        this.$uibModal = $uibModal;
        this.buttons = ToolbarService.getButtons();

        // add edit-post button
        ToolbarService.add({
            id: 'angularize_editor_post',
            title: 'Edit Post',
            icon: 'fa fa-2x fa-sticky-note-o',
            position: 1,
            is_logged_in: true,
            handler: () => {
                window.location.href = window.location.origin + '/new-post';
                //this.open('lg', 'newPost')
            }
        });

        // add my-posts button
        ToolbarService.add({
            id: 'angularize_my_post',
            title: 'My Posts',
            icon: 'fa fa-2x fa-bars',
            position: 1,
            is_logged_in: true,
            handler: () => {
                /*console.log("my posts button clicked")
                let elem = $compile('<new-post post-id="2" test="3"></new-post>')($rootScope)
                angular.element('body').prepend(elem);*/

                this.open('md', 'myPosts')
            }
        });

        let roles = window.angularize_server.currentUser.roles;
        if(roles.indexOf('editor') || roles.indexOf('administrator')) {
            ToolbarService.add({
                id: 'angularize_editorial_component',
                title: 'Editorial Dashboard',
                icon: 'fa fa-2x fa-list-alt',
                position: 2,
                is_logged_in: true,
                handler: () => {
                    this.open('lg', 'editorial');
                }
            });
        }

        let hasSeen = $window.localStorage.getItem("hasSeenTutorial");
        if(!hasSeen) {
            this.open('lg', 'tutorial');
            $window.localStorage.setItem("hasSeenTutorial", true);
        }
        
        ToolbarService.add({
            id: 'angularize_tutorial_component',
            title: 'Display tutorial',
            icon: 'fa fa-2x fa-info',
            position: 2,
            handler: () => {
                this.open('lg', 'tutorial');
            }
        });
    }

    $onInit() {
        // re-direct edit-links to new-post page
        document.querySelectorAll('a.post-edit-link').forEach(b => {
            b.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                let url = new URL(e.target.getAttribute('href'));
                let id = url.searchParams.get("post");
                window.location.href = window.location.origin + '/new-post?id=' + id;
            }
        });
    }

    open (size, component) {
        let modalInstance = this.$uibModal.open({
            component:  component,
            size: size
        });

        modalInstance.result.then(function (selectedItem) {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    show(b) {
        // if property is not defined - it don't matter,
        // if defined as true - should only display when server val is also true
        // if defined as false - should only not display when server val is true

        // example: when logged_in is not defined - it's good for both logged users and annonymous
        // when logged_in is defined as true - it's good for only logged in users
        // when logged_in is false - it's good for only logged_out users
        let isGood = (prop) => {
           return (!(prop in b)) || (b[prop] == window.angularize_server[prop]); 
        }       
        let res = isGood('is_logged_in') && isGood('is_single') && isGood('is_archive') && isGood('is_edit_page');
        return res;
    }
}

let Toolbar = {
    controller: ToolbarCtrl,
    bindings: {
        placement: '@'
    },
    templateUrl: 'components/toolbar.html'
};

export default Toolbar;