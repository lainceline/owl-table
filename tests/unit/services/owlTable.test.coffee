describe 'owl table service', ->
	service = {}
	defaults = {}
	$httpBackend = null
	saveHandler = null

	beforeEach module 'owlTable', ($provide) ->
		$provide.value('owlResource', () ->
			() ->
				{
					save: jasmine.createSpy()
				}
		)
		# need this null to avoid an error
		null

	beforeEach inject ($injector) ->
		service = $injector.get 'owlTable'
		defaults = $injector.get 'owlConstants'
		$httpBackend = $injector.get '$httpBackend'

	describe 'initializing', ->
		it 'creates the React element', ->
			spyOn React, 'createElement'
			service.initialize({
				data: [],
				columns: [],
				options: {}
			})
			expect(React.createElement).toHaveBeenCalled()

	describe 'registering', ->
		it 'adds the passed parameters to the table array', ->
			service.registerTable(1, () ->)
			expect(_.last(service.tables).id).toBe 1

	describe 'rendering', ->
		it 'renders the table into the dom when renderInto is called', ->
			spyOn(React, 'render').and.callFake (table, container) ->
				table = '<table></table>'
				$(container).append table
			container = $('<div></div>')
			service.renderInto container
			expect(container.find('table').length).toBeGreaterThan 0

	describe 'pagination', ->
		it 'will give the correct data for the page', ->
			service.page = 1
			service.count = 1

			service.data = [
				{foo: 'bar'},
				{foo: 'bar'}
			]

			expect(service.currentPageOfData().length).toBe 1
			expect(service.currentPageOfData()[0]).toEqual {foo: 'bar'}

		describe 'paginate()', ->
			it 'calculates the pagination parameters correctly', ->
				settings =
					count: 25
					total: 50
				service.paginate(settings)
				expect(service.pages).toBe 2
				expect(service.total).toBe 50
			it 'uses the default if no count is set', ->
				settings =
					total: 50
				service.paginate(settings)
				expect(service.count).toBe defaults.defaults.PER_PAGE


	describe 'its data', ->
		it 'can sync the data that is passed to it (from the table view)', ->
			service.data = [{id: 1, 'foo': null}]
			service.syncDataFromView {id: 1}, {field: 'foo'}, 'bar'
			expect(service.data[0].foo).not.toBeNull()
			expect(service.data[0].foo).toEqual 'bar'
		it 'can completely update the data', ->
			service.data = []
			service.renderedTable.setProps = (props) ->
				service.renderedTable.props = props
			newData = [{
				foo: 'bar'
			}]
			service.updateData newData
			expect(service.data).toBe newData
		it 'updates the table view when it updates the data completely', ->
			service.data = []
			service.renderedTable =
				props:
					data: []
				setProps: (props) ->
					service.renderedTable.props = props
			spyOn(service.renderedTable, 'setProps').and.callThrough()
			newData = [{
				foo: 'bar'
			}]
			service.updateData newData
			expect(service.renderedTable.setProps).toHaveBeenCalled()
			expect(service.renderedTable.props.data).toEqual newData

	describe 'its columns', ->
		describe 'completely updating the columns object', ->
			beforeEach ->
				service.columns =  []
				service.renderedTable.setProps = (props) ->
					service.renderedTable.props = props
				spyOn(service.renderedTable, 'setProps').and.callThrough()
			it 'can do it', ->
				newColumns = [{
					foo: 'bar'
				}]
				service.updateColumns newColumns
				expect(service.columns).toBe newColumns
			it 'updates the table view afterwards', ->
				newColumns = [{
					foo: 'bar'
				}]
				service.updateColumns newColumns
				expect(service.renderedTable.setProps).toHaveBeenCalled()
				expect(service.renderedTable.props.columns).toEqual newColumns

	describe 'saving', ->
		table = null
		beforeEach ->
			spyOn React, 'createElement'
			service.initialize(
				data: [],
				columns: [],
				options:
					saveUrl: '/save'
			)

			service.renderedTable =
				state:
					changedData: []

			saveHandler = $httpBackend.when('POST', '/save').respond({success: true})
		it 'can save all the changed data at once', ->
			changedData = [
				{foo: 'bar'},
				{baz: 'bin'}
			]
			$httpBackend.expectPOST '/save', data: changedData
			service.renderedTable.state.changedData = changedData
			service.saveAllChanged()
			$httpBackend.flush()
