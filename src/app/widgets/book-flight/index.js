export class BookFlightCtrl {
    constructor($log, $window) {
        $log.info("BookFlight: Initializing...");
        angular.extend(this, {'$window': $window, '$log': $log})
    }

    fly() {
        if(!this.from || !this.to) return; // we need both fields
        console.log("flying from " + this.from + " to " + this.to);
        let win = this.$window.open('https://google.com', '_blank');   
        win.focus();
    }
}

let BookFlight = {
    controller: BookFlightCtrl,
    template: require('./book-flight.html'),
    bindings: {
        from: '<',
        to: '<'
    }
}

export default BookFlight;