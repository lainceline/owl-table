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
      it('hides the ajax loading indicator when it has data', function() {
        var el;
        el = $('.owl-ajax-loading');
        return expect(el.isDisplayed().then(function(isDisplayed) {
          return isDisplayed;
        })).toBe(false);
      });
      return it('displays the data its given', function() {
        var foo, rows;
        foo = null;
        rows = element(By.tagName('table'));
        return rows.count().then(function(count) {
          return console.log(count);
        });
      });
    });
  });

}).call(this);
