export default class AppCtrl {
  constructor(Cache, PostService) {
    'ngInject';
    Cache.set("test", "testValue");
    console.log(Cache.get('test'));
    console.log(PostService.the_ID());    
    this.sample = 'angular works!';
	console.log(PostService.get_post());
  }
}
