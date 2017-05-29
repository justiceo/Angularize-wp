export class BookFlightCtrl {
    constructor($log) {
        $log.info("BookFlight: Initializing...");
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