export class AppCtrl {
  constructor() {
    this.sample = 'angular works!';
  }
}

let AppComponent = {
  template: require('./app.html'),
  controller: AppCtrl
}

export default AppComponent;