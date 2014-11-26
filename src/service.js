function owlTableService ($rootScope, owlConstants) {
	var service = {};

	service.tables = [];

	service.page = 1;
	service.pages = 20;
	service.total = 0;
	service.count = owlConstants.defaults.PER_PAGE;

	service.registerTable = function (id) {
		this.tables.push({ id: id });
	};

	service.tableWithId = function (id) {
		return this.tables.map(function (table) {
			if (table.id === id) {
				return table;
			}
		});
	};

	service.setCount = function (count) {
		this.count = count;
		$rootScope.$broadcast('owlCountChanged');
	};

	service.nextPage = function () {
		if (this.page < this.pages) {
			this.page += 1;
		}
	};

	service.prevPage = function () {
		if (this.page > 1) {
			this.page -= 1;
		}
	};

	return service;
}

angular.module('owlTable').service('owlTableService', ['$rootScope', 'owlConstants', owlTableService]);
