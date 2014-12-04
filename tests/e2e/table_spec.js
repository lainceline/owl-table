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
        var el;
        el = $('.owl-ajax-loading-label');
        el.getInnerHtml().then(function(html) {
          return expect(html).toBe('Loading data...');
        });
        return el.isDisplayed().then(function(displayed) {
          console.log(el);
          return expect(displayed).toBe(true);
        });
      });
    });
  });

}).call(this);
