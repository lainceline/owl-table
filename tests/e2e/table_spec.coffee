module.exports =
	"The owl-table is on the page with data": (browser) ->
		browser
			.url("http://localhost:9000")
			.waitForElementVisible('owl-table', 1000)
			.waitForElementPresent('.owl-row', 1000)

	"it has editable rows you can open": (browser) ->
		browser
			.click('.owl-row')
			.waitForElementVisible('.owl-input', 100)

	"you can go to the next page": (browser) ->
		browser
			.click('.owl-next-page')
			.assert.value('.owl-page-count input[type=text]', '2')

	"you cant go to page 0": (browser) ->
		browser
			.click('.owl-previous-page')
			.assert.value('.owl-page-count input[type=text]', '1')

	'the data actually changes on the next page': (browser) ->
		#value = browser.getValue('.owl-input')
		#console.log value
		browser
			.click('.owl-previous-page')
			.pause(25)
		#	.assert.element

	after: (browser) ->
		browser.end()
