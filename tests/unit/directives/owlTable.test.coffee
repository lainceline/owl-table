describe 'directive: owlTable', ->

	$rootScope = null;
	$compile = null;
	scope = null;
	element = null;

	beforeEach module 'owlTable'
	beforeEach module 'owlTablePartials'

	beforeEach inject (_$rootScope_, _$compile_) ->
		$rootScope = _$rootScope_
		$compile = _$compile_
		scope = $rootScope.$new()

		scope.data = []
		scope.columns = []
		scope.options = {}

		scope.data.push {id: 0, custom_200000: '123'} for datum in [0..10]
		scope.columns.push {type: 'text', field: 'custom_2000000', title: 'Custom 2000000'} for column in [0..10]
		scope.options =
			tacky:
				top:
					true

		element =
			'<owl-table data="data" options="options" columns="columns"></owl-table>'
		element = angular.element element
		element = $compile(element)(scope)

		scope.$digest()

	describe 'the directive', ->
		describe 'initializing', ->
			it 'should create 2 table elements', ->
				expect(element.find('table').length).toEqual 2
