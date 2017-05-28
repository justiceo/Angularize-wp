export class AppCtrl {
  constructor(Cache, PostService) {
    this.sample = 'angular works!';
  }
}

let AppComponent = {
  template: require('./app.html'),
  controller: AppCtrl,
  controllerAs: 'app'
}

export default AppComponent;