# @cjsx React.DOM

ReactTestUtils = null
column =
	field: 'foo'
	type: 'text'
	options: []

row =
	id: 0
	foo: 'bar'


describe 'Label Test', ->
	beforeEach ->
		ReactTestUtils = React.addons.TestUtils;

	it 'loads', ->
		input = <OwlInput column={column} row={row}></OwlInput>
		rendered = ReactTestUtils.renderIntoDocument input
		expect(rendered.getDOMNode().type).toBe 'text'
