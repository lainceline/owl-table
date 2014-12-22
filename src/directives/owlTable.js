(function (angular, _, $, Spinner) {
	'use strict';
	/**
	*	owlTableDirective
	*	Master directive of owl-table
	*	Definition function
	*/
	function owlTableDirective ($timeout, $window, owlTable) {
		return {
			restrict: 'EA',
			scope: {
				data: '=',
				columns: '=',
				options: '=',
				childColumns: '='
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

					scope.printing = false;

					scope.owlCtrl.massUpdate = false;
					scope.massUpdateData = {};

					scope.lockedCells = owlTable.lockedCells;

					$timeout(function () {
						scope.takingAWhile = true;
					}, 5000);

					rendered = owlTable.initialize({
						data: scope.data,
						columns: scope.columns,
						options: scope.options,
						childColumns: scope.childColumns
					}).renderInto(container);

					scope.$watch('data', function (newValue) {
						if (newValue.length > 0) {
							owlTable.updateData(newValue);

							scope.loading = false;
						}
					}, deepWatch);

					scope.$watchCollection('columns', function (newValue, oldValue) {
						if (newValue !== oldValue) {
							owlTable.updateColumns(newValue);
							scaleTableToColumns();
						}
					});

					scope.$watch('childColumns', function (newValue, oldValue) {
						owlTable.updateChildColumns(newValue);
						scaleTableToColumns();
					}, deepWatch);

					scope.$watch('options', function (newValue, oldValue) {
						owlTable.updateOptions(newValue, oldValue);
					}, deepWatch);

					scope.$watch('owlCtrl.massUpdate', function (newValue) {
						if (newValue === true) {
						//	console.log($('.owl-mass-update-header'));
							$('.owl-mass-update-header').each(function (index, header) {
							//	var columnHeader = $('.owl-table-sortElement[data-field="' + + '"]')
								header = $(header);
								var field = header.data('field');
								var columnHeader = $('.owl-table-sortElement[data-field="'+field+'"]');
							//	header.width(columnHeader.width());
							});

						}
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

					angular.element($window)
						.on('beforeunload', function () {
							if (owlTable.isDirty()) {
								return 'You have unsaved changes.  They will be lost if you leave.';
							}
						})
						.on('resize', function () {
							scaleTableToColumns();
						});

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

					var scaleTableToColumns = function () {
						var headers = $('owl-table').find('th');
						var tableWidth = headers.width() * headers.length;

						if (tableWidth > $('.owl-wrapper').width()) {
							$('.owl-table-wrapper').addClass('owl-stretch-after-load');
						}
					};

					scaleTableToColumns();
				};
			},
			controller: ['$scope', function ($scope) {
				var self = this;

				this.owlTable = owlTable;

				this.hasChangedData = owlTable.hasChangedData;

				this.nextPage = function () {
					owlTable.nextPage();
				};

				this.prevPage = function () {
					owlTable.prevPage();
				};

				this.savePage = function () {
					this.saving = true;

					owlTable.saveAllChanged();

					$timeout(function () {
						self.saving = false;
					}, 2000);
				};
			}]
		};
	}

	owlTableDirective.$inject = ['$timeout', '$window', 'owlTable'];

	angular.module('owlTable')
		.directive('owlTable', owlTableDirective);

})(window.angular, window._, window.jQuery, window.Spinner);
