export class PostStatusCtrl {
    setActive(status) {
        this.status = status;
    }

    $onInit() {
        console.log("ps: ", this.status);
    }
}

let PostStatus = {
    controller: PostStatusCtrl,
    template: `
    <div class="btn-group btn-group-sm" role="group" aria-label="Post Status">
        <button type="button" ng-click="$ctrl.setActive('draft')" ng-class="{active: $ctrl.status=='draft'}" class="btn btn-default">Draft</button>
        <button type="button" ng-click="$ctrl.setActive('pending')" ng-class="{active: $ctrl.status=='pending'}" class="btn btn-default">Pending Review</button>
        <button type="button" ng-click="$ctrl.setActive('published')" ng-class="{active: $ctrl.status=='published'}" class="btn btn-default">Published</button>
    </div>
    `,
    bindings: {
        status: '='
    }
}

export default PostStatus;