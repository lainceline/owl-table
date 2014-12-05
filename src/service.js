function owlResource ($http, owlConstants) {

	return function (options) {

		var saveUrl = '';

		if (typeof(options.saveUrl) !== 'undefined') {
			saveUrl = options.saveUrl;
		}

		var id = options.id;
		var column = options.column;
		var value = options.value;
		var params = options.params;

		var tableData = [{
			id: options.id
		}];

		tableData[0][column] = value;

		var data = _.clone(params);
		data.data = tableData;

		return {
			id: options.id,
			column: options.column,
			value: options.value,
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

function owlTableService ($http, $rootScope, owlConstants) {
	var unrenderedTable;

	var service = {
		tables: [],
		data: [],
		pageData: [],
		columns: [],
		options: {},
		renderedTable: {},
		page: 1,
		pages: 1,
		total: 0,
		count: owlConstants.defaults.PER_PAGE
	};

	service.lockedCells = [];

	service.initialize = function (settings) {
		this.data = settings.data;
		this.columns = settings.columns;
		this.options = settings.options;

		unrenderedTable = React.createElement(OwlTableReact, {
			data: settings.data,
			columns: settings.columns,
			tacky: settings.options.tacky,
			lockedCells: [],
			massUpdate: settings.options.massUpdate
		});

		return this;
	};

	service.renderInto = function (container) {
		this.rendered = React.render(unrenderedTable, container);

		return this.rendered;
	};

	service.registerTable = function (id, callback) {
		this.tables.push({
			id: id,
			callbacks: $.Callbacks().add(callback)
		});
	};

	service.currentPageOfData = function () {
		return this.data.slice(((this.page - 1) * this.count), ((this.page * this.count) - 1));
	};

	service.syncDataFromReact = function (row, column, value) {
		var modelRow = _(this.data).where({id: row.id}).first();
		modelRow[column.field] = value;
	};

	service.updateData = function (newData) {
		if (typeof newData !== 'undefined') {
			this.data = newData;
			this.rendered.setProps({
				data: this.currentPageOfData()
			});
		}
	};

	service.updateColumns = function (newColumns) {
		this.columns = newColumns;
		this.rendered.setProps({
			columns: this.columns
		});
	};

	service.updateOptions = function (newOptions) {
		this.options = newOptions;
		this.rendered.setProps({
			tacky: this.options.tacky
		});
	};

	service.updateTacky = function (newTacky) {
		this.options.tacky = newTacky;
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

		this.rendered.setProps({
			data: this.currentPageOfData(),
			pageChanged: true
		});
	};

	service.prevPage = function () {
		if (this.page > 1) {
			this.page -= 1;
		}

		this.rendered.setProps({
			data: this.currentPageOfData(),
			pageChanged: true
		});
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

		var data = _.clone(settings.params.post);
		data.data = settings.changedData;

		return $http({
			method: 'post',
			url: settings.where,
			data: data
		});
	};

	service.lockCell = function (row, column) {
		// row is id
		// column is the field string ie 'first_name'

		this.lockedCells[row] = column;

		var cell = {};
		cell[row] = column;

		newLockedCells = React.addons.update(this.rendered.props.lockedCells, {
			$push: [cell]
		});

		this.rendered.setProps({
			lockedCells: newLockedCells
		});
	};

	service.unlockCell = function (row, column) {
		this.lockedCells = this.lockedCells.map(function (cell, key) {
			if (column !== cell && row !== key) {
				return cell;
			}
		});

		var newCell = {};
		newCell[row] = column;

		var newLockedCells = this.rendered.props.lockedCells.filter(function (cell, index) {
			var cellField = cell[Object.keys(cell)[0]];
			var newField = newCell[Object.keys(newCell)[0]];

			if (cellField !== newField) {
				return true;
			}
		});

		this.rendered.setProps({
			lockedCells: newLockedCells
		});
	};

	return service;
}

angular.module('owlTable').service('owlTable', ['$http', '$rootScope', 'owlConstants', owlTableService])
	.service('owlResource', ['$http', 'owlConstants', owlResource]);
