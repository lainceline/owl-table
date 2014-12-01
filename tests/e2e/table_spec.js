(function() {
  describe('E2E: owl-table with demo page as testbed', function() {
    var By, ptor;
    ptor = {};
    By = null;
    beforeEach(function() {
      browser.get('http://localhost:9000');
      ptor = protractor.getInstance();
      return By = protractor.By;
    });
    return describe('owl-table', function() {
      return it('should initially display a loading indicator', function() {
        return expect(element(By.css('.owl-ajax-loading')).element(By.tagName('p')).getText()).toBe('Loading data...');
      });
    });
  });

}).call(this);
