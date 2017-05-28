export default class AppCtrl {
  constructor(Cache, PostService) {
    'ngInject';
    Cache.set("test", "testValue");
    this.sample = 'angular works!';
  }
}
