
describe 'E2E: owl-table with demo page as testbed', ->
	ptor = {}
	By = null

	beforeEach ->
		browser.get('http://localhost:4444')
		ptor = protractor.getInstance()
		By = protractor.By

	describe 'owl-table', ->
		it 'should initially display a loading indicator', ->
			expect(element(By.css('.owl-ajax-loading')).element(By.tagName('p')).getText()).toBe('Loading data...')
