(function (angular) {
	'use strict';

	function owlExportControls (owlTable) {
		return {
			restrict: 'EA',
			require: '^owlTable',
			templateUrl: 'partials/export.html',
			controllerAs: 'exportCtrl',
			compile: function (tElem, tAttrs) {
				return function link (scope, elem, attrs) {};
			},
			controller: ['$scope', function ($scope) {
				this.csvHeader = function () {
					return $scope.columns.map(function (column) {
						return column.title;
					});
				};
			}]
		};
	}

	owlExportControls.$inject = ['owlTable'];

	angular.module('owlTable')
		.directive('owlExportControls', owlExportControls);

})(window.angular);
