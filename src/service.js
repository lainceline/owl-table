function owlTableService ($http, owlConstants) {
	var service = {};

	service.tables = [];

	service.page = 1;
	service.pages = 1;
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

	// enables client-side pagination.
	service.paginate = function (settings) {

		if (typeof(settings.count) !== 'undefined') {
			this.count = settings.count;
		}

		this.pages = Math.ceil(settings.total / this.count);
		this.total = settings.total;
	};

	service.save = function (settings) {
		if (typeof(settings.where) === 'undefined') {
			throw 'OwlException: No save route provided to table!';
		}

		return $http({
			method: 'post',
			url: settings.where,
			data: {
				data: settings.changedData
			}
		});
	};

	return service;
}

angular.module('owlTable').service('owlTable', ['$http', 'owlConstants', owlTableService]);
