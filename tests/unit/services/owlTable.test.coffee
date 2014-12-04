describe 'owl table service', ->
	owlTable = {}
	mockResource = {}

	beforeEach module 'owlTable', ($provide) ->
		mockResource = {}
		mockResource.save = jasmine.createSpy()
		$provide.value 'owlResource', mockResource

	beforeEach inject (__owlTable__) ->
		owlTable = __owlTable__

	describe '', ->
		xit 'should initialize the react element', ->
