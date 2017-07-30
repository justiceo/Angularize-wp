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

// http://www.bradoncode.com/blog/2015/06/26/unit-testing-http-ngmock-fundamentals/