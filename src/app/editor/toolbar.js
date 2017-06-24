
export class ToolbarCtrl {
    constructor(ToolbarService) {
        this.buttons = ToolbarService.getButtons();
    }
}

let Toolbar = {
    controller: ToolbarCtrl,
    bindings: {
        placement: '@'
    },
    template: `    
    <div class="toolbar-wrapper bottom">
    <section layout="row" layout-align="center center" theme="default">
        <button md-button ng-repeat="button in $ctrl.buttons track by $index"
            class="md-fab"
            aria-label="{{ button.title }}"
            data-id="{{ button.id }}"            
            ng-class="button.class"
            ng-click="button.handler()" 
            ng-disabled="button.disabled">
            <i class="icons icon-{{ button.icon }}"></i>
            <md-tooltip md-direction="top" md-delay="200">
                {{ button.title }}
            </md-tooltip>
        </button md-button>
    </section>
    </div>
    `
};

export default Toolbar;