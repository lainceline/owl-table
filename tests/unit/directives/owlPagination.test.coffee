describe 'owlPagination', ->
	$rootScope = null
	$compile = null
	element = null
	scope = null

	service = null

	beforeEach module 'owlTable'
	beforeEach module 'owlTablePartials'

	beforeEach inject (_$rootScope_, _$compile_, owlTable) ->
		$rootScope = _$rootScope_
		$compile = _$compile_
		service = owlTable

		scope = $rootScope.$new()

	#	element = '<owl-pagination'
