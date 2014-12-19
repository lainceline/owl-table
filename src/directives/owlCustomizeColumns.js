(function (angular) {
	'use strict';

	function owlCustomizeColumns (owlTable) {
		return {
			restrict: 'EA',
			require: '^owlTable',
			templateUrl: 'partials/customizeColumns.html'
		};
	}

	angular.module('owlTable')
		.directive('owlCustomizeColumns', ['owlTable', owlCustomizeColumns]);

})(window.angular);
