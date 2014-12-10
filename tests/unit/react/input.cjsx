# @cjsx React.DOM

ReactTestUtils = null
column =
	field: 'foo'
	type: 'text'
	options: []

row =
	id: 0
	foo: 'bar'


describe 'OwlInput', ->
	beforeEach ->
		ReactTestUtils = React.addons.TestUtils;

	it 'loads', ->
		input = <OwlInput column={column} row={row}></OwlInput>
		rendered = ReactTestUtils.renderIntoDocument input
		expect(rendered.getDOMNode().type).toBe 'text'

	it 'strips html from select options', ->

		column.type = 'select'
		column.options = [{text: '<b>bar</b>', value: 1}]
		row.foo = '1'

		input = <OwlInput column={column} row={row}></OwlInput>
		rendered = ReactTestUtils.renderIntoDocument input
		node = $ rendered.getDOMNode()
		expect(node.find('option').text()).toBe 'bar'
