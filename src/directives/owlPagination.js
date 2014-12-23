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

	owlPagination.$inject = ['owlTable'];

	angular.module('owlTable')
		.directive('owlPagination', owlPagination);

})(window.angular);
