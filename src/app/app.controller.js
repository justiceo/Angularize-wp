export default class AppCtrl {
  constructor(Cache, PostService) {
    'ngInject';
    Cache.set("test", "testValue");
    console.log(Cache.get('test'));
    console.log(PostService.the_ID());
    this.url = 'https://github.com/preboot/angular-webpack';
  }
}
