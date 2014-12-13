function owlTableDirective ($http, $timeout, owlTable, owlResource) {
	return {
		restrict: 'EA',
		scope: {
			data: '=',
			columns: '=',
			options: '='
		},
		templateUrl: 'partials/table.html',
		controllerAs: 'owlCtrl',
		compile: function (tElem, tAttrs) {

			return function link (scope, elem, attrs) {
				var table;
				var rendered;
				var container = elem.find('.owl-react-container')[0];

				var deepWatch = true;

				owlTable.registerTable(elem[0].id);

				scope.loading = true;
				scope.takingAWhile = false;
				scope.saved = false;

				scope.owlCtrl.massUpdate = false;
				scope.massUpdateData = {};

				scope.lockedCells = owlTable.lockedCells;

				$timeout(function () {
					scope.takingAWhile = true;
				}, 5000);

				rendered = owlTable.initialize({
					data: scope.data,
					columns: scope.columns,
					options: scope.options
				}).renderInto(container);

				scope.$watch('data', function (newValue) {
					// use forthcoming empty() to remove all rows
					if (newValue.length > 0) {
						owlTable.updateData(newValue);

						scope.loading = false;
					}
				}, deepWatch);

				scope.$watchCollection('columns', function (newValue, oldValue) {
					if (newValue !== oldValue) {
						owlTable.updateColumns(newValue);
					}
				});

				scope.$watch('options', function (newValue, oldValue) {
					owlTable.updateOptions(newValue, oldValue);
				}, deepWatch);

				scope.$watch('owlCtrl.massUpdate', function (newValue) {
					rendered.setProps({
						massUpdate: newValue
					});
				});

				// Yeah, totaly gotta get this out of here.
				scope.massUpdate = function () {
					scope.data = scope.data.map(function (datum, index) {
						if (index < (owlTable.page * owlTable.count - 1)) {
							angular.forEach(scope.massUpdateData, function (value, field) {
								datum[field] = value;
							});
						}
						return datum;
					});
				};

				// Maybe this can stay since its an event handler.
				// But owlTable should be calling owlResource for sure.

				elem.on('owlTableUpdated', function (event, column, row, value) {
					if (scope.options.saveIndividualRows) {
						owlTable.saveRow(column, row, value).then(function (response) {
							scope.saved = true;
							$timeout(function () {
								scope.saved = false;
							}, 2000);
						});
					}

					owlTable.syncDataFromView(row, column, value);
				});

				var opts = {
					lines: 13, // The number of lines to draw
					length: 20, // The length of each line
					width: 10, // The line thickness
					radius: 30, // The radius of the inner circle
					corners: 1, // Corner roundness (0..1)
					rotate: 0, // The rotation offset
					direction: 1, // 1: clockwise, -1: counterclockwise
					color: '#000', // #rgb or #rrggbb or array of colors
					speed: 1, // Rounds per second
					trail: 60, // Afterglow percentage
					shadow: true, // Whether to render a shadow
					hwaccel: false, // Whether to use hardware acceleration
					className: 'spinner', // The CSS class to assign to the spinner
					zIndex: 2e9, // The z-index (defaults to 2000000000)
					top: '50%', // Top position relative to parent
					left: '50%' // Left position relative to parent
				};

				var target = document.getElementById('owl-spin');
				var spinner = new Spinner(opts).spin(target);

				(function adjustTableWidth () {
					var headers = $('owl-table').find('th');
					var tableWidth = headers.width() * headers.length;

					if (tableWidth > $('.owl-wrapper').width()) {
						$('.owl-table-wrapper').addClass('owl-stretch2');
					}
				})();
			};
		},
		controller: ['$scope', function ($scope) {
			this.owlTable = owlTable;

			this.nextPage = function () {
				owlTable.nextPage();
			};

			this.prevPage = function () {
				owlTable.prevPage();
			};

			this.savePage = function () {
				$scope.saving = true;

				owlTable.saveAllChanged();

				$timeout(function () {
					$scope.saving = false;
				}, 2000);
			};
		}]
	};
}

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

function owlExportControls (owlTable) {
	return {
		restrict: 'EA',
		require: '^owlTable',
		templateUrl: 'partials/export.html',
		controllerAs: 'exportCtrl',
		compile: function (tElem, tAttrs) {
			return function link (scope, elem, attrs) {};
		},
		controller: function ($scope) {
			this.csvHeader = function () {
				var header = [];
				header = $scope.columns.map(function (column, index) {
					return column.title;
				});

				return header;
			};
		}
	};
}

function owlCustomizeColumns (owlTable) {
	return {
		restrict: 'EA',
		require: '^owlTable',
		templateUrl: 'partials/customizeColumns.html',
		controllerAs: 'columnCtrl',
		link: function (scope, elem, attrs) {

		},
		controller: function ($scope) {

		}
	};
}

angular.module('owlTable')
	.directive('owlTable', ['$http', '$timeout', 'owlTable', 'owlResource', owlTableDirective])
	.directive('owlPagination', ['owlTable', owlPagination])
	.directive('owlFilterControls', ['owlTable', owlFilterControls])
	.directive('owlExportControls', ['owlTable', owlExportControls])
	.directive('owlCustomizeColumns', ['owlTable', owlCustomizeColumns]);
