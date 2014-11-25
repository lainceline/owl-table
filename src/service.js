function owlTableService () {
	var service = {};

	service.tables = [];

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
		console.log('update page count here');
	}

	return service;
}

angular.module('owlTable').service('owlTableService', owlTableService);
