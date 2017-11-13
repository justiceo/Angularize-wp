
describe('Models', function() {
    var models;
    beforeEach( function() {
        module('angularize');
        
        inject(function(Models) {
            models = Models;
        });          
    });

    it('should not be null or undefined', function(){
        expect(models).toBeDefined();
    });

    it('should convert plural words to singular form in a basic way', function() {
        expect(models.singularize('category')).toEqual('category');
        expect(models.singularize('categories')).toEqual('category');
        expect(models.singularize('buses')).toEqual('bus');
        expect(models.singularize('books')).toEqual('book');
        expect(models.singularize('halves')).toEqual('half');
        expect(models.singularize('c')).toEqual('c');
        expect(models.singularize('')).toEqual('');
        expect(models.singularize('knives')).toEqual('knif'); // known issue. todo: create exceptios list?
        expect(function(){models.singularize(null)}).toThrow();
    });

    it('should capitalize first letter of word', function() {
        expect(models.capitalize('cateGory')).toEqual('CateGory');
        expect(models.capitalize('c')).toEqual('C');
        expect(models.capitalize('DD')).toEqual('DD');
        expect(models.capitalize('')).toEqual('');
        expect(function(){models.capitalize(null)}).toThrow();
    })

    it('should convert routes list to schema objects', function() {
        
        var test_data = [
            {
                input:[],
                output:[],
                message:"empty array should yield nothing"
            },
            {
                input:null,
                output:[],
                message:'null should yield nothing'
            },
            {
                output:[],
                message:'undefined input should yield nothing'
            },
            {
                input:['/wp/v2', 'wc/v1'],
                output:[
                    {ns:'wp', url: '/wp/v2', name:'', type:'', version: 'v2'},
                    {ns:'wc', url: 'wc/v1', name:'', type:'', version: 'v1'}
                ],
                message: 'namespaces, url should be preserved. And shouldn\'t have name or type (since they\'re root)'
            },
            {
                input:['/wp/v2/posts'],
                output: [
                    { ns:'wp',
                     url: '/wp/v2/posts',
                     name: 'Posts',
                     type: 'arbitrary',
                     version: 'v2'
                 }],
                 message: 'simple collection (posts) should be resolved properly'
            },
            {
                input:['/wp/v2/posts/(?P<id>[\d]+)'],
                output: [
                    { ns:'wp',
                     url: '/wp/v2/posts/(?P<id>[\d]+)',
                     name: 'Post',
                     type: 'model',
                     version: 'v2'
                 }],
                 message: 'simple model (post) should be resolved properly'
            },
            {
                input:['/wp/v2/posts/(?P<id>[\d]+)/revisions'],
                output: [
                    { ns:'wp',
                     url: '/wp/v2/posts/(?P<id>[\d]+)/revisions',
                     name: 'PostRevisions',
                     type: 'arbitrary',
                     version: 'v2'
                 }],
                 message: 'nested collection (post revisions) should be resolved properly'
            },
            {
                input:['/wp/v2/posts/(?P<parent>[\d]+)/revisions/(?P<id>[\d]+)'],
                output: [
                    { ns:'wp',
                     url: '/wp/v2/posts/(?P<parent>[\d]+)/revisions/(?P<id>[\d]+)',
                     name: 'PostRevision',
                     type: 'model',
                     version: 'v2'
                 }],
                 message: 'nested model (post revision) should be resolved properly'
            },
            {
                input:['/wc/v2/posts/categories'],
                output: [
                    { ns:'wc',
                     url: '/wc/v2/posts/categories',
                     name: 'PostCategories',
                     type: 'arbitrary',
                     version: 'v2'
                 }],
                 message: 'collection in collection should be resolved properly'
            }
        ]

        test_data.forEach(function(t) {
            expect(models.getSchema(t.input)).toEqual(t.output, t.message);
        })
    });
})