// combines an input box with uib-typeahead
export class ChipsCtrl {
    constructor($scope) {
        this.$scope = $scope;
    }
    $onInit() {
        this.selected = this.selected || [];
        this.placeholderText = this.emptyText;
    }
        
    push(item, model, label, event) {
        console.log("selected fired");
        this.selected.push(item);
        this.placeholderText = this.someText;
        this.model = null;
    }

}

let Chips = {
    controller: ChipsCtrl,
    template: `
        <span class="chips">
            <ul class="selected-chips">
                <li ng-repeat="s in $ctrl.selected">{{ s }}</li>
            </ul>
            <input ng-model="$ctrl.uibSelected" 
                placeholder="{{ $ctrl.placeholderText }}"
                uib-typeahead="t for t in $ctrl.available | filter:$viewValue" 
                typeahead-on-select="$ctrl.push($item, $model, $label, $event)"
                typeahead-select-on-exact="true"
                typeahead-input-formatter="transform($item)"
                class="form-control">
        </span>
        <style scoped>
            .chips {
                background: #fff;
                display: block;
                margin: 15px auto;
                box-shadow: 0 0 20px #d1d1d1;
                border: 1px solid #ccc;
                padding: 16px 5px;
                margin-top: 3px;
                transition: box-shadow 0.3s;
            }
            .chips:hover { box-shadow: 0 0 35px #bbb;}
            .chips:focus {
                box-shadow: 0 0 35px #bbb;
                border: 1px solid #222;
            }

            .chips > ul.selected-chips { 
                display: inline-block;
                margin-bottom: 0;
                padding-left: 0;
                margin-left: 0;
            }
            .chips > .selected-chips > li {
                display: inline;
                background: #f1f1f1;
                padding: 7px 10px;
                border-radius: 3px;
                margin-left: 6px;
                border: 1px solid #ccc;
                box-shadow: 1px 1px 3px #ccc;
            }
            .chips > input {
                border: none;
                outline: none;
                margin-left: 8px;                
            }
        </style>
    `,
    bindings: {
        available: '=',
        selected: '=',
        emptyText: '@',
        someText: '@'
    }
}

export default Chips;