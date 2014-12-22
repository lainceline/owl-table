(function (angular, _, $, Spinner) {
	'use strict';

	function owlSpinner(owlTable) {
		function link (scope, elem, attrs, tableCtrl) {
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

			var target = angular.element('#owl-spin').get(0);

			var spinner = new Spinner(opts).spin(target);
		}

		return {
			restrict: 'EA',
			require: '^owlTable',
			link: link,
			templateUrl: 'partials/ajaxLoader.html'
		};
	}
	angular.module('owlTable')
		.directive('owlSpinner', ['owlTable', owlSpinner]);
		
})(window.angular, window._, window.jQuery, window.Spinner);
