
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
    <div class="angularize-toolbar toolbar-wrapper bottom">
        <ul>
            <li ng-repeat="button in $ctrl.buttons track by $index">
                <button 
                    ng-class="button.class" 
                    ng-click="button.handler()"
                    data-id="{{ button.id }}"
                    aria-label="{{ button.title }}"
                    ng-disabled="button.disabled">B</button>
            </li>
        </ul>
    </div>
    <style scoped>
        .angularize-toolbar { margin-left: 30%; }
        .angularize-toolbar li {
            list-style: none;
            float: left;
            margin: 0 10px;
            outline: none;
        }
        .angularize-toolbar li button {
            color: #222;
            background: white;
            border-radius: 50%;
            border: 1px solid #bbb;
            box-shadow: 1px 0 8px #ccc;
            padding: 30px 32px;
            outline: none;
        }
        .angularize-toolbar li button:hover, .angularize-toolbar li button:focus {
            background: #222;
            color: white;
        }
        /* todo: animate hover, add icons, add tooltip, proper centering */
    </style>
    `
};

export default Toolbar;