describe 'E2E: owl-table with demo page as testbed', ->
	ptor = {}

	beforeEach ->
		browser.get('http://localhost:9000')
		ptor = protractor.getInstance()
