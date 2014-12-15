describe 'owl table service', ->
	service = {}
	defaults = {}
	$httpBackend = null
	saveHandler = null
	ajaxServiceMock = {}
	realAjaxService = null

	beforeEach module 'owlTable', ($provide) ->
	#	$provide.value('owlResource', ajaxServiceMock)
		# need this null to avoid an error
		null

	beforeEach inject ($injector) ->
		service = $injector.get 'owlTable'
		defaults = $injector.get 'owlConstants'

		$q = $injector.get '$q'
		deferred = $q.defer()
		deferred.resolve 'foo'
		ajaxServiceMock = jasmine.createSpy('owlResource').and.callFake () ->
			{
				save: jasmine.createSpy('save').and.returnValue deferred.promise
			}

		ajaxServiceMock = $injector.get 'owlResource'

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
		it 'can send you the table record by id', ->
			service.registerTable(1, () ->)
			expect(service.tableWithId(1)).toEqual [service.tables[0]]

	describe 'rendering', ->
		it 'renders the table into the dom when renderInto is called', ->
			spyOn(React, 'render').and.callFake (table, container) ->
				table = '<table></table>'
				$(container).append table
			container = $('<div></div>')
			service.renderInto container
			expect(container.find('table').length).toBeGreaterThan 0

	describe 'tacky integration', ->
		it 'can update the tacky object', ->
			service.options.tacky = {}
			newTacky =
				top: true
			service.updateTacky newTacky
			expect(service.options.tacky).toBe newTacky

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

		it 'can update the item per page count', ->
			service.setCount(50)
			expect(service.count).toBe 50

		describe 'changing to the next page', ->
			beforeEach ->
				service.renderedTable =
					setProps: () ->
				spyOn service.renderedTable, 'setProps'
				service.pages = 5
				service.page = 1
				service.count = 1
				service.data = [{foo: 'bar'}, {baz: 'bin'}]

			it 'can do it', ->
				service.nextPage()
				expect(service.page).toBe 2
			it 'updates the table view afterwards', ->
				service.nextPage()
				expectedProps =
					data: [{baz: 'bin'}]
					pageChanged: true
				expect(service.renderedTable.setProps).toHaveBeenCalledWith expectedProps

		describe 'changing to the previous page', ->
			beforeEach ->
				service.renderedTable =
					setProps: () ->
				spyOn service.renderedTable, 'setProps'
				service.pages = 5
				service.page = 2
				service.count = 1
				service.data = [{foo: 'bar'}, {baz: 'bin'}]

			it 'can do it', ->
				service.prevPage()
				expect(service.page).toBe 1
			it 'updates the table view afterwards', ->
				service.prevPage()
				expectedProps =
					data: [{foo: 'bar'}]
					pageChanged: true
				expect(service.renderedTable.setProps).toHaveBeenCalledWith expectedProps

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
		beforeEach ->
			service.renderedTable =
				props:
					data: []
				setProps: (props) ->
					service.renderedTable.props = props

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
			expect(service.data).toEqual newData
		it 'updates the table view when it updates the data completely', ->
			service.data = []

			spyOn(service.renderedTable, 'setProps').and.callThrough()
			newData = [{
				foo: 'bar'
			}]
			service.updateData newData
			expect(service.renderedTable.setProps).toHaveBeenCalled()
			expect(service.renderedTable.props.data).toEqual newData

		it 'sorts the data according to the set predicate', ->
			data = [
				{id: 0, foo: 'zdw'},
				{id: 1, foo: 'abc'},
				{id: 2, foo: 'bcd'},
				{id: 3, foo: 'aae'}
			]

			service.options.sort.column = 'foo'
			service.updateData data

			expect(service.data).toEqual [
				{id: 3, foo: 'aae'},
				{id: 1, foo: 'abc'},
				{id: 2, foo: 'bcd'},
				{id: 0, foo: 'zdw'}
			]

		it 'returns the original data if no predicate is set', ->
			data = [
				{id: 0, foo: 'zdw'},
				{id: 1, foo: 'abc'},
				{id: 2, foo: 'bcd'},
				{id: 3, foo: 'aae'}
			]

			service.updateData data

			expect(service.data).toEqual data

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

		describe 'saving all the changed data at once', ->
			changedData = [
				{foo: 'bar'},
				{baz: 'bin'},
				{foo2: '12-DEC-23'}
			]

			beforeEach ->
				service.renderedTable.setState = ((state) -> this.state = state).bind service.renderedTable
				service.renderedTable.state.changedData = changedData

			it 'can do it', ->
				$httpBackend.expectPOST '/save', data: changedData
				service.saveAllChanged()
				$httpBackend.flush()

			it 'throws an exception if there is no save url set', ->
				service.options.saveUrl = undefined
				expect(service.saveAllChanged.bind(service)).toThrow(defaults.exceptions.noSaveRoute)
				service.options.saveUrl = ''
				expect(service.saveAllChanged.bind(service)).toThrow(defaults.exceptions.noSaveRoute)
				service.options.saveUrl = null
				expect(service.saveAllChanged.bind(service)).toThrow(defaults.exceptions.noSaveRoute)

			it 'sends along any params if they are set', ->
				service.options.ajaxParams =
					post:
						foo: 'bar'
				$httpBackend.expectPOST '/save', {data: changedData, foo: 'bar'}
				service.saveAllChanged()
				$httpBackend.flush()

			it 'clears the changedData', ->
				$httpBackend.expectPOST '/save', data: changedData
				service.saveAllChanged()
				$httpBackend.flush()
				expect(service.renderedTable.state.changedData).toEqual {}

			it 'can manually clear the changedData too', ->
				service.renderedTable.state.changedData = changedData
				fooBack =
					bar: () -> 'foo'
				spyOn fooBack, 'bar'
				service.clearAllChanged fooBack.bar
				expect(service.renderedTable.state.changedData).toEqual {}
				expect(fooBack.bar).toHaveBeenCalled()

		describe 'saving one row at a time', ->
			changedRow = {foo: 'bar'}
			xit 'delegates to a resource service', ->
				saved = service.saveRow {field: 'foo'}, {id: 0, 'foo': 'bar'}, 'baz'

	describe 'locking and unlocking cells', ->
		beforeEach ->
			spyOn(React.addons, 'update').and.callFake ->
				[{foo: 'bar'}]

			data = [{id:0, lockedCells: [], custom_1: 1}]
			columns = [{
				field: 'custom_1'
			}, {
				field: 'custom_2'
			}]
			service.data = data
			service.columns = columns
			service.renderedTable =
				props:
					data: data
					columns: columns

				setProps: (props) -> service.renderedTable.props = props

		describe 'locking a cell', ->
			it 'adds the column field to the locked array for the row', ->
				row = service.renderedTable.props.data[0]
				col = service.renderedTable.props.columns[0]
				service.lockCell row.id, col.field
				expect(row.lockedCells.length).toBe 1

		describe 'unlocking a cell', ->
			it 'removes the cell from the locked cell array', ->
				row = service.data[0]
				col = service.columns[0]

				row.lockedCells.push 'custom_1'

				service.unlockCell row.id, col.field
				expect(row.lockedCells.length).toBe 0
