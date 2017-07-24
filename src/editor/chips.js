// combines an input box with uib-typeahead
export class ChipsCtrl {
    $onInit() {
        //this.selected = this.selected || [];
        this.placeholderText = this.emptyText;
    }
        
    add(item, model, label, event) {
        this.selected.push(item);
        this.available = this.available.filter(e => e.id != item.id)
        this.placeholderText = this.someText;
        this.model = null;
        if(this.onChange) this.onChange({$selected: this.selected});
    }

    transform(item) {
        console.log("transform called");
    }

    removeChip(chip) {
        console.log("remove chip called");
        this.selected = this.selected.filter(s => s.id !== chip.id);
        this.available.push(chip);
        if(this.onChange) this.onChange({$selected: this.selected});
    }
    // todo: use 'text-stroke' to lighten fontawesome icons
}

let Chips = {
    controller: ChipsCtrl,
    template: `
        <span class="chips">
            <ul class="selected-chips">
                <li ng-repeat="s in $ctrl.selected track by s.id">{{ s.name }}<i ng-click="$ctrl.removeChip(s)" class="chip-remove fa fa-times"></i></li>
            </ul>
            <input ng-model="$ctrl.uibSelected" 
                placeholder="{{ $ctrl.placeholderText }}"
                uib-typeahead="t.name for t in $ctrl.available | filter:$viewValue" 
                typeahead-on-select="$ctrl.add($item, $model, $label, $event)"
                typeahead-select-on-exact="true"
                typeahead-input-formatter="$ctrl.transform($item)"
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
                display: inline-block;
                background: #f1f1f1;
                padding: 7px 10px;
                border-radius: 3px;
                margin-left: 6px;
                margin-bottom: 16px;
                border: 1px solid #ccc;
                box-shadow: 1px 1px 3px #ccc;
            }
            .chips > .selected-chips > li > i {
                    padding: 5px 0px 5px 7px;
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
        onChange: '&',
        emptyText: '@',
        someText: '@'
    }
}

export default Chips;