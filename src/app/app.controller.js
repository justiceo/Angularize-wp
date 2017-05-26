import Cache from './providers/cache';

export default class AppCtrl {
  constructor(Cache) {
    Cache.set("test", "testValue");
    console.log(Cache.get('test'));
    this.url = 'https://github.com/preboot/angular-webpack';
  }
}
