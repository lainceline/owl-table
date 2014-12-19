(function (angular) {
	'use strict';

	function owlFilterControls (owlTable) {
		return {
			restrict: 'EA',
			require: '^owlTable',
			templateUrl: 'partials/filter.html',
			compile: function (tElem, tAttrs) {
				return function link (scope, elem, attrs) {};
			}
		};
	}

	angular.module('owlTable')
		.directive('owlFilterControls', ['owlTable', owlFilterControls]);

})(window.angular);
