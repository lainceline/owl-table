(function (angular) {
	'use strict';

	function owlPagination (owlTable) {
		return {
			restrict: 'EA',
			require: '^owlTable',
			templateUrl: 'partials/pagination.html',
			compile: function (tElem, tAttrs) {
				return function link (scope, elem, attrs) {

				};
			}
		};
	}

	angular.module('owlTable')
		.directive('owlPagination', ['owlTable', owlPagination]);

})(window.angular);
