function owlTableDirective (owlTableService) {
	return {
		restrict: 'EA',
		scope: {
			data: '=',
			columns: '='
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
					console.log('owl table watch on data was called');
					if (newValue !== oldValue) {
						console.log('and a change was detected');
						rendered.setProps({
							data: newValue
						});
					}
				});
			};
		},
		controller: function ($scope) {
			this.owlTable = owlTableService;

			this.nextPage = function () {
				owlTableService.nextPage();
				$scope.$emit('owlNextPage');
			};

			this.prevPage = function () {
				owlTableService.prevPage();
				$scope.$emit('owlPrevPage');
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
	.directive('owlTable', ['owlTableService', owlTableDirective])
	.directive('owlPagination', ['owlTableService', owlPagination])
	.directive('owlFilterControls', ['owlTableService', owlFilterControls])
	.directive('owlExportControls', ['owlTableService', owlExportControls]);
