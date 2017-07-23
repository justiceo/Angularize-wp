module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      'build/assets/main.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'test/**/*.spec.js'
    ]
  });
};