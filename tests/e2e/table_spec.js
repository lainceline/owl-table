(function() {
  module.exports = {
    "The owl-table is on the page with data": function(browser) {
      return browser.url("http://localhost:9000").waitForElementVisible('owl-table', 1000).waitForElementPresent('.owl-row', 1000);
    },
    "it has editable rows you can open": function(browser) {
      return browser.click('.owl-row').waitForElementVisible('.owl-input', 100);
    },
    "you can go to the next page": function(browser) {
      return browser.click('.owl-next-page').assert.value('.owl-page-count input[type=text]', '2');
    },
    "you cant go to page 0": function(browser) {
      return browser.click('.owl-previous-page').assert.value('.owl-page-count input[type=text]', '1');
    },
    'the data actually changes on the next page': function(browser) {
      return browser.click('.owl-previous-page').pause(25);
    },
    after: function(browser) {
      return browser.end();
    }
  };

}).call(this);
