(function () {

	function owlTableDirective () {
		return {
			restrict: 'EA',
			scope: {
				data: '=',
				columns: '='
			},
			templateUrl: 'partials/table.html',
			compile: function (tElem, tAttrs) {

				return function link (scope, elem, attrs) {
					var table;
					var rendered;
					var container = elem.find('.owl-react-container')[0];

					table = React.createElement(OwlTable, {
						data: scope.data,
						columns: scope.columns
					});

					rendered = React.render(table, container);

					scope.$watchCollection('data', function (newValue, oldValue) {
						rendered.setProps({
							data: newValue
						});
					});
				};
			}
		};
	}

})();
