(function () {
	angular
		.module(
			'owlTable',
			[

			]
		)
		.constant('owlConstants', owlConstants)
		.service('owlTable', owlTableService)
		.directive('owlTable', owlTableDirective);
})();
