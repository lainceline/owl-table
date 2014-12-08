describe 'service: owlResource', ->
	$httpBackend = null
	service = null
	saveHandler = null

	options = {}
	resource = null

	beforeEach module 'owlTable'

	beforeEach inject ($injector) ->
		$httpBackend = $injector.get '$httpBackend'
		service = $injector.get 'owlResource'

	beforeEach ->
		options =
			id: 0
			column: 'foo'
			value: 'bar'
			saveUrl: '/save'
		resource = service(options)

	describe 'what it represents', ->
		it 'returns a resource object', ->
			expect(resource).toBeDefined()
		it 'has the properties you passed to it', ->
			expect(resource.id).toBe 0
			expect(resource.column).toBe 'foo'
			expect(resource.value).toBe 'bar'
		it 'plus a save handler', ->
			expect(resource.save).toBeDefined()
			expect(typeof resource.save).toBe 'function'

	describe 'saving a record', ->
		beforeEach ->
			saveHandler = $httpBackend.when('POST', '/save').respond({success: true})

		describe 'save()', ->
			it 'sends the object to the specified url', ->
				$httpBackend.expectPOST '/save', data: [{id: 0, foo: 'bar'}]
				resource.save()
				$httpBackend.flush()
			it 'also attaches any params you specify such as csrf token', ->
				$httpBackend.expectPOST '/save', {test_param: 'foo', data: [{id: 0, foo: 'bar'}]}
				options.params =
					test_param: 'foo'
				resource = service(options)
				resource.save()
				$httpBackend.flush()
