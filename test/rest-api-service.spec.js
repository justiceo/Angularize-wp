describe('RestApi', function() {
    var service;
    beforeEach( function() {
        module('angularize');

        inject(function(RestApi) {
            service = RestApi;
        }) 
    });

    it('should not be null or undefined', function(){
        expect(service).toBeDefined();
    });
})