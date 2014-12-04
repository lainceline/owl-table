
describe 'E2E: owl-table with demo page as testbed', ->
	ptor = {}
	By = null

	beforeEach ->
		browser.get('http://localhost:9000')
		ptor = protractor.getInstance()
		By = protractor.By

	describe 'owl-table', ->
		it 'should initially display a loading indicator', ->
			el = $('.owl-ajax-loading-label')

			el.getInnerHtml().then (html) ->
				expect(html).toBe('Loading data...')

			el.isDisplayed().then (displayed) ->
				expect(displayed).toBe true

		#	expect(element(By.css('.owl-ajax-loading-label')).getText()).toBe('Loading data...')
