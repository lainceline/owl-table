function owlTableDirective ($http, $timeout, owlTable) {
	return {
		restrict: 'EA',
		scope: {
			data: '=',
			columns: '=',
			save: '@',
			tacky: '=owlTacky'
		},
		templateUrl: 'partials/table.html',
		controllerAs: 'owlCtrl',
		compile: function (tElem, tAttrs) {
			owlTable.registerTable(tElem[0].id);

			return function link (scope, elem, attrs) {
				var table;
				var rendered;
				var container = elem.find('.owl-react-container')[0];

				scope.loading = true;
				scope.takingAWhile = false;
				$timeout(function () {
					scope.takingAWhile = true;
				}, 5000);

				table = React.createElement(OwlTableReact, {
					data: scope.data,
					columns: scope.columns,
					tacky: scope.tacky
				});

				rendered = React.render(table, container);

				scope.$watchCollection('data', function (newValue, oldValue) {
					console.log('watch called');
					if (newValue !== oldValue) {
						console.log('and we are updating table');
						rendered.setProps({
							data: scope.owlCtrl.dataForPage(owlTable.page)
						});
						scope.loading = false;
					}
				});

				scope.$watchCollection('tacky', function (newValue) {
					rendered.setProps({
						tacky: newValue
					});
				});

				elem.on('owlTableUpdated', function (event, column, row, value) {

					// Could ajax the saved row to the server here.

					event.stopPropagation();
				});
				
				scope.saveButtonClicked = function (event) {
					scope.saving = true;

					owlTable.save({
						changedRows: rendered.state.changedData,
						where: scope.save
					}).then(function (response) {
						scope.saving = false;
						console.log('save successful');

						rendered.setState({
							changedData: {}
						});
					});
				};

				scope.owlCtrl.nextPage = function () {
					owlTable.nextPage();
					// set the table props to the data for the new page.
					rendered.setProps({
						data: scope.owlCtrl.dataForPage(owlTable.page)
					});
				};

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
			};
		},
		controller: function ($scope) {
			this.owlTable = owlTable;

			this.prevPage = function () {
				owlTable.prevPage();
				$scope.data = this.dataForPage(owlTable.page);
			};

			this.dataForPage = function (page) {
				//beginning: the page number times the count - 1 ex. 25 for page 2 with default count
				//end: the page number times the count -1 ex. 49 for page 2 with default count

				var data = $scope.data.slice(((page - 1) * this.owlTable.count), ((page * this.owlTable.count) - 1));

				return data;
			};
		}
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
		compile: function (tElem, tAttrs) {
			return function link (scope, elem, attrs) {};
		}
	};
}

function ngTacky () {
	return {
		restrict: 'A',
		link: function (scope, elem, attrs) {
			console.log(elem.find('table'));
			elem.find('table').addClass('tacky');
			elem.find('thead').find('th').addClass('tacky-top');
			//$(elem).tacky();
		}
	};
}

angular.module('owlTable')
	.directive('owlTable', ['$http', '$timeout', 'owlTable', owlTableDirective])
	.directive('owlTacky', [ngTacky])
	.directive('owlPagination', ['owlTable', owlPagination])
	.directive('owlFilterControls', ['owlTable', owlFilterControls])
	.directive('owlExportControls', ['owlTable', owlExportControls]);
