export class ReactionCtrl {
    constructor(RestApi) {
        this.RestApi = RestApi;
    }
    $onInit() {
        this.buttons = [
            {
                id: 'like-button',
                title: 'like',
                icon: 'em em---1'
            },
            {
                id: 'joy-button',
                title: "Crackin' Up",
                icon: 'em em-joy'
            },
            {
                id: 'soso-button',
                title: 'so so',
                icon: 'em em-expressionless'
            },
            {
                id: 'enlightened-button',
                title: "Learned sometin'",
                icon: 'em em-bulb'
            }
        ]
    }
}

let Reaction = {
    controller: ReactionCtrl,
    templateUrl: 'components/reaction.html'
}

export default Reaction;