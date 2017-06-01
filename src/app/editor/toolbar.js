
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
            uib-tooltip="{{ button.title }}"
            tooltip-placement="top"
            tooltip-class="le-tooltip"
            tooltip-popup-delay="800"
            tooltip-popup-close-delay="100"
            ng-class="button.class"
            ng-click="button.handler()" 
            ng-disabled="button.disabled">
            <md-icon md-font-icon="{{ button.icon }}"></md-icon>       
        </button md-button>
    </section>
    </div>
    `
};

export default Toolbar;