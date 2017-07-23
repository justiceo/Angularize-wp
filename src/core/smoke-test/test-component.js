export class TestCtrl {
  constructor() {
    this.sample = 'angular works!';
  }
}

let TestComponent = {
  templateUrl: 'core/smoke-test/test-view.html',
  controller: TestCtrl
}

export default TestComponent;