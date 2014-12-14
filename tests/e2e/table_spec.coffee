module.exports =
	"The owl-table is on the page with data": (browser) ->
		browser
			.url("http://localhost:9000")
			.waitForElementVisible('owl-table', 10000)
			.waitForElementPresent('.owl-row', 10000)

	"it has editable rows you can open": (browser) ->
		browser
			.click('.owl-row')
			.waitForElementVisible('.owl-input', 500)

	"you can go to the next page": (browser) ->
		browser
			.click('.owl-next-page')
			.assert.value('.owl-page-count input[type=text]', '2')

	"you can go to the prev page": (browser) ->
		#value = browser.getValue('.owl-input')
		#console.log value
		browser
			.click('.owl-previous-page')
			.assert.value '.owl-page-count input[type=text]', '1'
		#	.assert.element

	"you can't go to page 0": (browser) ->
		browser
			.click('.owl-previous-page')
			.assert.value('.owl-page-count input[type=text]', '1')

	"you can customize the columns": (browser) ->
		browser
			.click '.owl-customize-columns-button'
			.pause 200
			.assert.visible '.owl-modal-body'
			.click '#customize_custom_2000001'
			.pause 200
			.assert.cssClassPresent '#customize_custom_2000001', 'strikethrough'
	after: (browser) ->
		browser.end()
