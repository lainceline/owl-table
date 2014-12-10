"use strict";

var ReactTestUtils;

describe("Label Test",function(){
	beforeEach(function() {
		ReactTestUtils = React.addons.TestUtils;
		console.log(React.addons);
	});

	it('loads', function () {
		var input = <OwlInput></OwlInput>;
		ReactTestUtils.renderIntoDocument(input);
	});
});
