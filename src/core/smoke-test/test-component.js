export class TestCtrl {
  constructor() {
    this.sample = 'angular works!';
  }
}

let TestComponent = {
  template: require('./test-view.html'),
  controller: TestCtrl
}

export default TestComponent;