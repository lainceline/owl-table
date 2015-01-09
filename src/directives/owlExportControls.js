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

					var data = _.cloneDeep($scope.data);

					return data.map(function (datum, index) {
						_.forOwn(datum, function (value, key) {
							var column = _.where(columns, {'field': key});
							column = _.first(column);
							if (typeof column !== 'undefined') {
								if (typeof column.options !== 'undefined') {
									var option = _.where(column.options, {'value': value});
									option = _.first(option) || {};
									if (typeof option.text !== 'undefined') {
										var div = document.createElement("div");
										div.innerHTML = option.text;
										datum[key] = div.textContent || div.innerText || "";
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
