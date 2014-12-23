(function (angular, _) {
	'use strict';

	function owlResource ($http, owlUtils) {

		return function (options) {

			var saveUrl = '';

			if (typeof(options.saveUrl) !== 'undefined') {
				saveUrl = options.saveUrl;
			}

			var column = options.column;
			var value = options.value;
			var params = options.params;
			var data = {};

			var tableData = [{
				id: options.id
			}];

			tableData[0][column] = value;

			if (typeof params !== 'undefined') {
				data = _.clone(params);
			}

			data.data = tableData;

			return {
				id: options.id,
				column: options.column,
				value: options.value,
				saveUrl: saveUrl,
				save: function () {
					return $http({
						method: 'post',
						url: saveUrl,
						data: data
					});
				}
			};
		};
	}

	owlResource.$inject = ['$http', 'owlUtils'];

	angular.module('owlTable')
		.factory('owlResource', owlResource);

})(window.angular, window._);
