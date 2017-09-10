import MediumEditor from 'medium-editor';

let Suggest = MediumEditor.extensions.button.extend({
    name: 'suggest',
    tagNames: ['mark'],
    contentDefault: '<b>S</b>',
    contentFA: '<i class="fa fa-paint-brush"></i>',
    aria: 'Suggest',
    action: 'suggest',

    init: function() {
       MediumEditor.extensions.button.prototype.init.call(this); 
    }
});

export default Suggest