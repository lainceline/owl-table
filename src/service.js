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

function owlTableService ($http, $rootScope, $filter, owlConstants, owlResource) {
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
		count: owlConstants.defaults.PER_PAGE,
		predicate: 'id',
		sortReverse: false
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
			massUpdate: settings.options.massUpdate,
			sortClickHandler: this.sortClickHandler
		});

		return this;
	};

	service.sortClickHandler = function (field, reverse) {
		if (typeof reverse !== 'undefined' && reverse !== null && reverse !== '') {
			service.sortReverse = reverse;
		}
		service.predicate = field;
		service.sort(reverse);
	};

	service.renderInto = function (container) {
		this.renderedTable = React.render(unrenderedTable, container);

		return this.renderedTable;
	};

	service.registerTable = function (id, callback) {
		this.tables.push({
			id: id,
			callbacks: $.Callbacks().add(callback)
		});
	};

	service.currentPageOfData = function () {
		var startIndex = (this.page - 1) * this.count;
		var endIndex = this.page * this.count;

		endIndex = endIndex > 0 ? endIndex : 1;
		return this.data.slice(startIndex, endIndex);
	};

	service.sorted = function (data) {
		return $filter('orderBy')(data, this.predicate, this.sortReverse);
	};

	service.sort = function () {
		this.updateData(this.sorted(this.data));
	};

	service.syncDataFromView = function (row, column, value) {
		var modelRow = _(this.data).where({id: row.id}).first();
		modelRow[column.field] = value;
	};

	service.updateData = function (newData) {
		if (typeof newData !== 'undefined') {
			newData = this.sorted(newData);
			this.data = newData;
			this.renderedTable.setProps({
				data: this.currentPageOfData()
			});
		}
	};

	service.updateColumns = function (newColumns) {
		this.columns = newColumns;
		this.renderedTable.setProps({
			columns: this.columns
		});
	};

	service.updateOptions = function (newOptions) {
		this.options = newOptions;
		this.renderedTable.setProps({
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

		this.renderedTable.setProps({
			data: this.currentPageOfData(),
			pageChanged: true
		});
	};

	service.prevPage = function () {
		if (this.page > 1) {
			this.page -= 1;
		}

		this.renderedTable.setProps({
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

	service.saveAllChanged = function () {
		var data = {};
		if (typeof(this.options.saveUrl) === 'undefined' || this.options.saveUrl === null || this.options.saveUrl === '') {
			throw owlConstants.exceptions.noSaveRoute;
		}

		if (typeof this.options.ajaxParams !== 'undefined') {
			data = _.clone(this.options.ajaxParams.post);
		}

		data.data = this.renderedTable.state.changedData;

		// should call my own ajax service
		return $http({
			method: 'post',
			url: this.options.saveUrl,
			data: data
		}).then(function (response) {
			this.renderedTable.setState({
				changedData: {}
			});
		}.bind(this));
	};

	service.saveRow = function (column, row, value) {
		var params;

		if (typeof(this.options.saveUrl) === 'undefined' || this.options.saveUrl === null || this.options.saveUrl === '') {
			throw owlConstants.exceptions.noSaveRoute;
		}

		if (typeof this.options.ajaxParams !== 'undefined') {
			params = this.options.ajaxParams.post || '';
		}

		return owlResource({
			id: row.id,
			column: column.field,
			value: value,
			saveUrl: this.options.saveUrl,
			params: params
		}).save();
	};

	service.lockCell = function (row, column) {
		// row is id
		// column is the field string ie 'first_name'

		this.lockedCells[row] = column;

		var cell = {};
		cell[row] = column;

		newLockedCells = React.addons.update(this.renderedTable.props.lockedCells, {
			$push: [cell]
		});

		this.renderedTable.setProps({
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

		var newLockedCells = this.renderedTable.props.lockedCells.filter(function (cell, index) {
			var cellField = cell[Object.keys(cell)[0]];
			var newField = newCell[Object.keys(newCell)[0]];

			if (cellField !== newField) {
				return true;
			}
		});

		this.renderedTable.setProps({
			lockedCells: newLockedCells
		});
	};

	return service;
}

angular.module('owlTable').service('owlTable', ['$http', '$rootScope', '$filter', 'owlConstants', 'owlResource', owlTableService])
	.factory('owlResource', ['$http', 'owlConstants', owlResource]);
