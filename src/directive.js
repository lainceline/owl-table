function owlTableDirective (owlTableService) {
	return {
		restrict: 'EA',
		scope: {
			data: '=',
			columns: '='
		},
		templateUrl: 'partials/table.html',
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
					if (newValue !== oldValue) {
						rendered.setProps({
							data: newValue
						});
					}
				});
			};
		}
	};
}

angular.module('owlTable').directive('owlTable', ['owlTableService', owlTableDirective]);
