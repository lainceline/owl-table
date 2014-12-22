(function (angular) {
	'use strict';

	function owlUtils (owlConstants) {

		function firstRowIfExists (array) {
			if (typeof array === 'undefined' || array.length === 0) {
				return false;
			} else {
				return array[0];
			}
		}

		function escapeRegExp (string) {
			return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		}

		var utilService = {
			firstRowIfExists: firstRowIfExists,
			escapeRegExp: escapeRegExp
		};

		return utilService;
	}

	owlUtils.$inject = ['owlConstants'];

	angular.module('owlTable')
		.service('owlUtils', owlUtils);

})(window.angular);
