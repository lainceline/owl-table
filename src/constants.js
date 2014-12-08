(function () {
	angular.module('owlTable').constant('owlConstants', {
		defaults: {
			PER_PAGE: 25
		},
		exceptions: {
			noSaveRoute: {
				type: 'OwlException: noSaveRoute',
				error: 'No save route provided to table!'
			}
		}
	});
})();
