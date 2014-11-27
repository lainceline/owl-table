function owlTableDirective ($http, owlTableService) {
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
			owlTableService.registerTable(tElem[0].id);

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
							data: scope.owlCtrl.dataForPage(owlTableService.page)
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

					// Should abstract this into a service or delegate it to user provided thing
					$http({
						method: 'post',
						url: scope.save,
						data: {
							data: rendered.state.changedData
						}
					}).then(function (response) {
						scope.saving = false;
						console.log('save successful');
					});

					rendered.setState({
						changedData: {}
					});
				};

				scope.owlCtrl.nextPage = function () {
					owlTableService.nextPage();
					// set the table state to the data for the new page.
					rendered.setProps({
						data: scope.owlCtrl.dataForPage(owlTableService.page)
					});
				};
			};
		},
		controller: function ($scope) {
			this.owlTable = owlTableService;

			this.prevPage = function () {
				owlTableService.prevPage();
				$scope.data = this.dataForPage(owlTableService.page);
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

function owlPagination (owlTableService) {
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

function owlFilterControls (owlTableService) {
	return {
		restrict: 'EA',
		require: '^owlTable',
		templateUrl: 'partials/filter.html',
		compile: function (tElem, tAttrs) {
			return function link (scope, elem, attrs) {};
		}
	};
}

function owlExportControls (owlTableService) {
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
	.directive('owlTable', ['$http', 'owlTableService', owlTableDirective])
	.directive('owlPagination', ['owlTableService', owlPagination])
	.directive('owlFilterControls', ['owlTableService', owlFilterControls])
	.directive('owlExportControls', ['owlTableService', owlExportControls]);
