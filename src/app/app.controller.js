export default class AppCtrl {
  constructor(Cache, PostService, Ajax) {
    'ngInject';
    Cache.set("test", "testValue");
    console.log(Cache.get('test'));
    console.log(PostService.the_ID());
    Ajax.get_posts().then(
      s => { console.log("first ", s); },
      e => console.log("first err ", e)
    )
    Ajax.get_posts().then(
      s => { console.log("second ", s); },
      e => console.log("second err ", e)
    )
    this.sample = 'angular works!';
  }
}
