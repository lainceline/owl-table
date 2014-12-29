(function (angular, _, $) {

	function swiftboxDirective ($timeout, $document) {
		return {
			restrict: 'E',
			scope: false,
			replace: true,
			template: function (elem, attrs) {
				return '<select ng-options="' + attrs.optexp + '" ></select>';
			},
			link: function (scope, elem, attrs) {
				$timeout(function () {
					$(elem).addClass('swiftbox').swiftbox();
				}, 100);

				$($document).on('change', 'swift-box', function (event) {
					console.log(event);
					console.log($(this).swiftbox('value'));
					console.log(attrs.ngModel);
					var model = scope.$eval(attrs.ngModel);
				//	model =
				console.log(model);
					model = $(this).swiftbox('value');
					model = {
						value: $(this).swiftbox('value')
					};
				});
			}
		};
	}

	angular.module('swiftbox', [])
		.directive('swiftBox', ['$timeout', '$document', swiftboxDirective]);

})(window.angular, window._, window.jQuery);
