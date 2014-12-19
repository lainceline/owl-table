(function (angular) {
	'use strict';

	function owlUtils (owlConstants) {

		function firstRowOrThrow (array) {
			if (typeof array === 'undefined' || array.length === 0) {
				throw owlConstants.exceptions.noRow;
			} else {
				return array[0];
			}
		}

		function escapeRegExp (string) {
			return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		}

		var utilService = {
			firstRowOrThrow: firstRowOrThrow,
			escapeRegExp: escapeRegExp
		};

		return utilService;
	}

	angular.module('owlTable')
		.service('owlUtils', ['owlConstants', owlUtils]);

})(window.angular);
