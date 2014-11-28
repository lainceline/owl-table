function owlTableDirective ($http, owlTable) {
	return {
		restrict: 'EA',
		scope: {
			data: '=',
			columns: '=',
			save: '@'
		},
		templateUrl: 'partials/table.html',
		controllerAs: 'owlCtrl',
		compile: function (tElem, tAttrs) {
			owlTable.registerTable(tElem[0].id);

			return function link (scope, elem, attrs) {
				var table;
				var rendered;
				var container = elem.find('.owl-react-container')[0];

				table = React.createElement(OwlTableReact, {
					data: scope.data,
					columns: scope.columns
				});

				rendered = React.render(table, container);

				scope.$watchCollection('data', function (newValue, oldValue) {
					console.log('watch called');
					if (newValue !== oldValue) {
						console.log('and we are updating table');
						rendered.setProps({
							data: scope.owlCtrl.dataForPage(owlTable.page)
						});
					}
				});

				elem.on('owlTableUpdated', function (event) {
					var updatedRow = event.result;

					// Could ajax the saved row to the server here.

					// Put it into the scope.data array. Is this ugly? Yes.
					$.grep(scope.data, function (e) { return e.id === updatedRow.id; })[0] = updatedRow;

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
					// set the table state to the data for the new page.
					rendered.setProps({
						data: scope.owlCtrl.dataForPage(owlTable.page)
					});
				};
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
				console.log(page);
				var data = $scope.data.slice(((page - 1) * 25), ((page * 25) - 1));
				console.log($scope.data);
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

angular.module('owlTable')
	.directive('owlTable', ['$http', 'owlTable', owlTableDirective])
	.directive('owlPagination', ['owlTable', owlPagination])
	.directive('owlFilterControls', ['owlTable', owlFilterControls])
	.directive('owlExportControls', ['owlTable', owlExportControls]);
