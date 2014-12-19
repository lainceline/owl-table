//(function (angular) {
	'use strict';

	angular.module('owlTable').constant('owlConstants', {
		defaults: {
			PER_PAGE: 25
		},
		exceptions: {
			noSaveRoute: {
				type: 'OwlException: noSaveRoute',
				error: 'No save route provided to table!'
			},
			noRow: {
				type: 'OwlException: noRow',
				error: 'Row does not exist'
			},
			badData: {
				type: 'OwlException: badData',
				error: 'Invalid data collection tried to be set on owlTable service'
			}
		},
		filtering: {
			STARTS_WITH: 2,
			ENDS_WITH: 4,
			EXACT: 8,
			CONTAINS: 16,
			defaults: {
				term: '',
				condition: 16,
				flags: {
					caseSensitive: false
				}
			}
		}
	});

//})(window.angular);
