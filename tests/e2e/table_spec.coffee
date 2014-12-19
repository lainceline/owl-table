testHeader = '#owl_header_custom_2000001'
customizeColumnsButton = '.owl-customize-columns-button'
modalColumnToClick = '#customize_custom_2000001'

module.exports =
	"The owl-table is on the page with data": (browser) ->
		browser
			.url("http://localhost:9000")
			.waitForElementVisible('owl-table', 10000)
			.waitForElementPresent('.owl-row', 10000)

	"it has editable rows you can open": (browser) ->
		browser
			.click('#demoTable > div > div.owl-table-wrapper.owl-stretch-after-load > div.owl-table-inner-wrapper.table-responsive.tacky > div > table > tbody > tr:nth-child(1) > td.custom_2000000 > span')
			.waitForElementVisible('.owl-input', 500)

	"you can go to the next page": (browser) ->
		browser
			.click('.owl-next-page')
			.assert.value('.owl-page-count input[type=text]', '2')

	"you can go to the prev page": (browser) ->
		browser
			.click('.owl-previous-page')
			.assert.value '.owl-page-count input[type=text]', '1'

	"you can't go to page 0": (browser) ->
		browser
			.click('.owl-previous-page')
			.assert.value('.owl-page-count input[type=text]', '1')

	"you can remove a column": (browser) ->
		browser
			.assert.elementPresent testHeader
			.click customizeColumnsButton
			.waitForElementVisible '.owl-modal-body', 10000
			.click modalColumnToClick
			.pause 200
			.assert.cssClassPresent '#customize_custom_2000001', 'strikethrough'
			.click '.owl-column-modal-ok'
			.pause 200
			.assert.elementNotPresent testHeader

	"you can add the column back": (browser) ->
		browser
			.assert.elementNotPresent testHeader
			.click customizeColumnsButton
			.waitForElementVisible '.owl-modal-body', 10000
			.click modalColumnToClick
			.pause 200
			.assert.cssClassNotPresent '#customize_custom_2000001', 'strikethrough'
			.click '.owl-column-modal-ok'
			.pause 500
			.assert.elementPresent testHeader

	"you can sort": (browser) ->
		browser
			.useXpath()
			.click '//*[@id="owl_header_custom_2000000"]/i'
			.pause 3000
			.useCss()
			.assert.containsText 'td.custom_2000000 > span', '1'
			#.assert.containsText '', '1'
			#.assert.containsText '//*[@id="demoTable"]/div/div[2]/div[2]/div/table/tbody/tr[3]/td[1]/span', '1'

	"you can lock a cell": (browser) ->
		browser
			.useXpath()
			.setValue '/html/body/div/nav/div/ul/li[2]/div/input', 1
			.pause 200
			.click '/html/body/div/nav/div/ul/li[2]/div/button[1]'
			.pause 500
			#.assert.cssClassNotPresent '//*[@id="demoTable"]/div/div[2]/div[2]/div/table/tbody/tr[1]/td[1]/span', 'owl-editable'
			.click '//*[@id="demoTable"]/div/div[2]/div[2]/div/table/tbody/tr[1]/td[1]'
			.pause 500
		#	.assert.elementNotPresent '//*[@id="demoTable"]/div/div[2]/div[2]/div/table/tbody/tr[1]/td[1]/input'


	after: (browser) ->
		browser.end()
