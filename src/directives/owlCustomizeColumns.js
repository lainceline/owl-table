(function (angular) {
	'use strict';

	function owlCustomizeColumns (owlTable) {
		return {
			restrict: 'EA',
			require: '^owlTable',
			templateUrl: 'partials/customizeColumns.html'
		};
	}

	owlCustomizeColumns.$inject = ['owlTable'];
	
	angular.module('owlTable')
		.directive('owlCustomizeColumns', owlCustomizeColumns);

})(window.angular);
