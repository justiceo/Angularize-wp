
export class ToolbarCtrl {
    constructor(ToolbarService) {
        this.buttons = ToolbarService.getButtons();

        // todo: use 'text-stroke' to lighten fontawesome icons
        // add edit-post button
        ToolbarService.add({
            id: 'angularize_editor_post',
            title: 'Edit Post',
            icon: 'fa fa-2x fa-sticky-note-o',
            position: 1,
            handler: () => {console.log("edit button clicked")}
        });

        // add my-posts button
        ToolbarService.add({
            id: 'angularize_my_post',
            title: 'My Posts',
            icon: 'fa fa-2x fa-bars',
            position: 1,
            handler: () => {console.log("edit button clicked")}
        });
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
                    ng-class="[button.class, button.icon]" 
                    ng-click="button.handler()"
                    data-id="{{ button.id }}"
                    aria-label="{{ button.title }}"
                    uib-tooltip="{{ button.title }}"
                    tooltip-placement="top"
                    ng-disabled="button.disabled"></button>
            </li>
        </ul>
    </div>
    <style scoped>
        .angularize-toolbar { 
            position: fixed;
            bottom: 40px;
            width: 100%;
        }
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
            box-shadow: 1px 0 8px rgba(0,0,0,0.2);
            padding: 20px 22px;
            outline: none;
            transition: background 0.8s, color 0.8s;
        }
        .angularize-toolbar li button:hover {
            background: #222;
            color: white;           
        }
        /* todo: animate hover, add icons, add tooltip, proper centering */
    </style>
    `
};

export default Toolbar;