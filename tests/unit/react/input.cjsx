# @cjsx React.DOM

ReactTestUtils = null
column =
	field: 'foo'
	type: 'text'
	options: []

row =
	id: 0
	foo: 'bar'

describe 'owl-table input components', ->
	beforeEach ->
		ReactTestUtils = React.addons.TestUtils;

	describe 'OwlInput', ->
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

	describe 'OwlTextInput', ->
		it 'renders a text input field by default', ->
			input = <OwlTextInput />
			rendered = ReactTestUtils.renderIntoDocument input
			node = $ rendered.getDOMNode()

			expect(rendered.getDOMNode().type).toBe 'text'
		it 'fires a callback when it changes', ->
			test = {
				callback: (cell, event) ->
			}

			cell =
				recordId: 1
				columnField: 'custom_2000001'

			spyOn(test, 'callback').and.callThrough()
			input = <OwlTextInput onChange={test.callback} cell={cell}/>
			rendered = ReactTestUtils.renderIntoDocument input
			node = rendered.getDOMNode()
			ReactTestUtils.Simulate.change node, { target: { value: 'foo' }}
			passedCell = test.callback.calls.argsFor(0)[0]
			expect(passedCell).toEqual cell
