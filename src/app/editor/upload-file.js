/**
 * todo: make me a component
 */
export class UploadFileCtrl {
    constructor() {
        this.restrict = 'A';
        this.transclude = true;
        this.template = function(elem, attrs) {
            var tag = elem[0].nodeName;
            return ''
        }
    }

    link(scope, element, attr) {
        element.bind('click', function(e) {
            angular.element(e.target).siblings('#upload').trigger('click');
        });
    }
}

let UploadFileDirective = function() {
    return new UploadFileCtrl();
}

export default UploadFileDirective;