import MediumEditor from 'medium-editor';
import rangy from 'rangy';

rangy.init();

var Suggest = MediumEditor.extensions.button.extend({
    name: 'suggest',
    action: 'highlight',
    aria: 'suggest',
    tagNames: ['mark'],
    contentDefault: '<b>S</b>',
    contentFA: '<i class="fa fa-paint-brush"></i>',
    //parent: true,

    init: function () {
        MediumEditor.extensions.button.prototype.init.call(this);
        console.log("rangy:", rangy);
        this.classApplier = rangy.createClassApplier('highlight', {
        elementTagName: 'mark',
        normalize: true
        });
    },

    handleClick: function(event) {
        console.log("suggest click:", event);
        this.classApplier.toggleSelection();
        this.base.checkContentChanged();
    }
    
});

export default Suggest