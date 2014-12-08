describe 'E2E: owl-table with demo page as testbed', ->
	ptor = {}
	By = null

	beforeEach ->
		browser.get('http://localhost:9000')
		ptor = protractor.getInstance()
		By = protractor.By

	describe 'owl-table', ->
		it 'hides the ajax loading indicator when it has data', ->
			el = $('.owl-ajax-loading')
			expect(el.isDisplayed().then((isDisplayed) -> isDisplayed)).toBe false
		it 'displays the data its given', ->
			foo = null
			rows = element(By.tagName('table'))
			rows.count().then((count) -> console.log count)
