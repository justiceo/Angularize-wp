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

    removeChip(chip) {
        console.log("remove chip called");
        this.selected = this.selected.filter(s => s.id !== chip.id);
        this.available.push(chip);
        if(this.onChange) this.onChange({$selected: this.selected});
    }
}

let Chips = {
    controller: ChipsCtrl,
    templateUrl: 'components/chips.html',
    bindings: {
        available: '=',
        selected: '=',
        onChange: '&',
        emptyText: '@',
        someText: '@'
    }
}

export default Chips;