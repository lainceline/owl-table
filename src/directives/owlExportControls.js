(function (angular, $) {
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

				this.csvData = function () {
					var columns = $scope.columns;

					return $scope.data.map(function (datum, index) {
						_.forOwn(datum, function (value, key) {
							var column = _.where(columns, {'field': key});
							column = _.first(column);
							if (typeof column !== 'undefined') {
								if (typeof column.options !== 'undefined') {
									var option = _.where(column.options, {'value': value});
									option = _.first(option) || {};
									if (typeof option.text !== 'undefined') {
										// do this jquery thing to strip out any html
										datum[key] = $(option.text).text();
									}
								}
							} else {
								delete datum[key];
							}
						});

						return datum;
					});
				};
			}]
		};
	}

	owlExportControls.$inject = ['owlTable'];

	angular.module('owlTable')
		.directive('owlExportControls', owlExportControls);

})(window.angular, window.jQuery);
