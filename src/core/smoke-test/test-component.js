export class TestCtrl {
  constructor() {
    this.sample = 'angular works!';
  }
}

let TestComponent = {
  templateUrl: './test-view.html',
  controller: TestCtrl
}

export default TestComponent;