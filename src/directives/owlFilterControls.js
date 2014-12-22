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

	owlFilterControls.$inject = ['owlTable'];

	angular.module('owlTable')
		.directive('owlFilterControls', owlFilterControls);

})(window.angular);
