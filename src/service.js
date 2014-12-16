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

function owlTableService ($http, $rootScope, $filter, $modal, owlConstants, owlResource, owlUtils, owlFilter) {
	var unrenderedTable;

	var service = {
		tables: [],
		data: [],
		pageData: [],
		columns: [],
		options: {
			sort: {
				column: 'id',
				order: 'asc'
			}
		},
		renderedTable: {},
		page: 1,
		pages: 1,
		total: 0,
		count: owlConstants.defaults.PER_PAGE,
		hasChangedData: false,
		filteringEnabled: false
	};

	service.lockedCells = [];

	var defaults = {
		options: {
			sort: {
				column: 'id',
				order: 'asc'
			}
		}
	};

	service.initialize = function (settings) {
		this.data = settings.data;
		this.columns = settings.columns;
		this.options = _.defaults(settings.options, defaults.options);
		_.forEach(this.columns, function (column) {
			if (typeof column.visible === 'undefined') {
				column.visible = true;
			}
		});
		unrenderedTable = React.createElement(OwlTableReact, {
			data: settings.data,
			columns: settings.columns,
			tacky: settings.options.tacky,
			lockedCells: [],
			addFilter: function (column) {
				column.filters.push({});

				service.renderedTable.setProps({
					columns: service.columns
				});
			},
			massUpdate: settings.options.massUpdate,
			sortClickHandler: this.sortClickHandler,
			filterDidChange: this.filterDidChange.bind(this),
			filteringEnabled: this.filteringEnabled
		});

		return this;
	};

	service.toggleFiltering = function () {
		this.filteringEnabled = !this.filteringEnabled;
		this.renderedTable.setProps({
			filteringEnabled: this.filteringEnabled
		});
	};

	service.sortClickHandler = function (field, reverse) {
		if (typeof reverse !== 'undefined' && reverse !== null && reverse !== '') {
			service.options.sort.order = reverse === true ? 'desc' : 'asc';
		}

		service.options.sort.column = field;
		service.sort();
	};

	service.renderInto = function (container) {
		this.renderedTable = React.render(unrenderedTable, container);
		this.container = container;
		return this.renderedTable;
	};

	service.registerTable = function (id, callback) {
		this.tables.push({
			id: id,
			callbacks: $.Callbacks().add(callback)
		});
	};

	service.currentPageOfData = function (data) {
		var pageOfData;
		var startIndex = (this.page - 1) * this.count;
		var endIndex = this.page * this.count;

		endIndex = endIndex > 0 ? endIndex : 1;
		if (typeof data !== 'undefined') {
			pageOfData = data.slice(startIndex, endIndex);
		} else {
			pageOfData = this.data.slice(startIndex, endIndex);
		}
		return pageOfData;
	};

	service.sorted = function (data) {
		var reverse = this.options.sort.order === 'desc' ? true : false;
		var sortColumn = _.where(this.columns, {'field': this.options.sort.column})[0];
		if (typeof sortColumn !== 'undefined') {
			if (sortColumn.type.indexOf('select') > -1) {
				return $filter('orderBy')(data, function (datum) {
					var option = _.where(sortColumn.options, {'value': datum[sortColumn.field]})[0];
					var text = (!option ? '' : $('<p>').html(option.text).text());
					return text;
				}, reverse);
			}
		}
		return $filter('orderBy')(data, this.options.sort.column, reverse);
	};

	service.sort = function () {
		this.updateData(this.sorted(this.data));
	};

	service.syncDataFromView = function (row, column, value) {
		$rootScope.$apply((function () {
			var modelRow = _(this.data).where({id: row.id}).first();
			modelRow[column.field] = value;
			this.hasChangedData = true;
		}).bind(this));
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

	service.customizeColumns = function () {
		var self = this;

		var modal = $modal.open({
			templateUrl: 'partials/columnModal.html',
			controller: function ($scope, $modalInstance, columns) {
				$scope.columns = columns;
				$scope.visibleColumns = _.filter(columns, function (column) {
					return column.visible !== false;
				});

				$scope.toggleColumn = function (column) {
					column.visible = !column.visible;
				};
				$scope.ok = function () {
					$modalInstance.close($scope.columns);
				};
			},
			size: 'lg',
			resolve: {
				columns: function () {
					return self.columns;
				}
			},
			backdrop: 'static',
		});

		modal.result.then(function (columns) {
			self.updateColumns(columns);
		});
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

	service.clearAllChanged = function (callback) {
		this.renderedTable.setState({
			changedData: {}
		});

		if (typeof callback !== 'undefined') {
			callback();
		}
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
		var self = this;

		this.throwIfNoSaveRoute();

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
			self.renderedTable.setState({
				changedData: {}
			});
			self.hasChangedData = false;
		});
	};

	service.saveRow = function (column, row, value) {
		var params;

		this.throwIfNoSaveRoute();

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

	service.lockCell = function (rowId, columnField) {
		var ourRow = owlUtils.firstRowOrThrow(
			_.filter(this.data, function (datum) {
				/* jshint ignore:start */
				return datum.id == rowId;
				/* jshint ignore:end */
			})
		);

		if (typeof ourRow.lockedCells === 'undefined') {
			ourRow.lockedCells = [];
		}

		ourRow.lockedCells.push(columnField);
		ourRow.lockedCells = _.uniq(ourRow.lockedCells);
	};

	service.unlockCell = function (rowId, columnField) {
		var ourRow = owlUtils.firstRowOrThrow(
			_.filter(this.data, function (datum) {
				/* jshint ignore:start */
				return datum.id == rowId;
				/* jshint ignore:end */
			})
		);

		ourRow.lockedCells = _.without(ourRow.lockedCells, columnField);
	};

	service.isDirty = function () {
		return this.hasChangedData || !_.isEmpty(this.renderedTable.state.changedData);
	};

	service.throwIfNoSaveRoute = function () {
		if (typeof(this.options.saveUrl) === 'undefined' || this.options.saveUrl === null || this.options.saveUrl === '') {
			throw owlConstants.exceptions.noSaveRoute;
		}
	};

	service.filterDidChange = function (filter) {
		var rows = owlFilter.filterTable(this.data, this.columns);
		//console.log(owlFilter.hasNoFilters(this.columns));
		if (!owlFilter.hasNoFilters(this.columns)) {
			console.log('filters');
			this.paginate({
				total: rows.length
			});
			this.renderedTable.setProps({
				data: this.currentPageOfData(rows)
			});
		} else {
			console.log('no filters');
			this.paginate({
				total: this.data.length
			});
			this.renderedTable.setProps({
				data: this.currentPageOfData()
			});
		}
	};

	return service;
}

function owlUtils (owlConstants) {
	var utilService = {
		firstRowOrThrow: function (array) {
			if (typeof array === 'undefined' || array.length === 0) {
				throw owlConstants.exceptions.noRow;
			} else {
				return array[0];
			}
		},
		escapeRegExp: function (string) {
			return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		}
	};

	return utilService;
}

function owlFilter (owlConstants, owlUtils) {
	var filterService = {
		hasNoFilters: function (columns) {
			return _.every(columns, function (column) {
				var ret = false;
				if (_.isEmpty(column.filters)) {
					ret = true;
				} else {
					ret = _.every(column.filters, function (filter) {
						return filter.term === '';
					});
				}

				return ret;
			});
		},
		getTerm: function (filter) {
			if (typeof filter.term === 'undefined') {
				return filter.term;
			}

			var term = filter.term;

			if (typeof term === 'string') {
				term = term.trim();
			}

			return term;
		},
		stripTerm: function (filter) {
			var term = this.getTerm(filter);

			if (typeof term === 'string') {
				return owlUtils.escapeRegExp(term.replace(/(^\*|\*$)/g, ''));
			} else {
				return term;
			}
		},
		guessConditionRegex: function (filter) {
			if (typeof filter.term === 'undefined' || !filter.term) {
				return owlConstants.filtering.defaults.condition;
			}

			var term = colFilter.getTerm(filter);

			if (/\*/.test(term)) {
				var regexpFlags = '';
				if (!filter.flags || !filter.flags.caseSensitive) {
					regexpFlags += 'i';
				}

				var reText = term.replace(/(\\)?\*/g, function ($0, $1) { return $1 ? $0 : '[\\s\\S]*?'; });
				return new RegExp('^' + reText + '$', regexpFlags);
			} else {
				return owlConstants.filtering.defaults.condition;
			}
		},
		filterCell: function (row, column, termCache, i, filter) {
			var conditionType = typeof filter.condition;
			if (conditionType === 'undefined' || !conditionType) {
				filter.condition = owlConstants.filtering.CONTAINS;
			}

			var cacheId = column.field + i;

			var regexpFlags = 'i';

			var value = row[column.field];
			var term = this.stripTerm(filter);

			if (term === null || term === undefined || term === '') {
				return true;
			}

			if (filter.condition instanceof RegExp) {
				if (!filter.condition.test(value)) {
					return false;
				}
			} else {
				var containsRE = termCache(cacheId) ? termCache(cacheId) : termCache(cacheId, new RegExp(term, regexpFlags));

				if (!containsRE.test(value)) {
					return false;
				}
			}

			return true;
		},
		filterColumn: function (row, column, termCache) {
			var filters;

			if (typeof column.filters !== 'undefined' && column.filters && column.filters.length > 0) {
				filters = column.filters;
			} else {
				return true;
			}

			for (var i in filters) {
				var filter = filters[i];
				console.log(filter);
				var ret = this.filterCell(row, column, termCache, i, filter);
				if (ret === true) {
					return true;
				}
			}

			return false;
		},
		filterTable: function (rows, columns) {
			var self = this;

			if (!rows) {
				return;
			}

			var termCache = new QuickCache();

			var filterCols = [];
			var filteredRows = [];

			angular.forEach(columns, function (column, key) {
				if (typeof column.filters !== 'undefined' && column.filters.length > 0 && typeof column.filters[0].term !== 'undefined' && column.filters[0].term) {
					filterCols.push(column);
				} else if (typeof column.filters !== 'undefined' && column.filters && typeof column.filters[0].term !== 'undefined' && column.filters[0].term) {
					// Don't ask, cause I don't know.
					filterCols.push(column);
				}
			});

			var rowShouldBeThere = false;

			if (filterCols.length > 0) {
				angular.forEach(rows, function forEachRow (row, key) {
					rowShouldBeThere = true;
					angular.forEach(filterCols, function forEachColumn (col, key) {
						if (self.filterColumn(row, col, termCache) === false) {
							rowShouldBeThere = true;
						}
					});

					if (rowShouldBeThere === true) {
						filteredRows.push(row);
					}
				});
			}

			termCache.clear();

			return filteredRows;
		}
	};

	return filterService;
}

function QuickCache() {
	var c = function(get, set) {
		// Return the cached value of 'get' if it's stored
		if (get && c.cache[get]) {
			return c.cache[get];
		} else if (get && set) {
			c.cache[get] = set;
			return c.cache[get];
		} else {
			return undefined;
		}
	};

	c.cache = {};

	c.clear = function () {
		c.cache = {};
	};

	return c;
}

angular.module('owlTable').service('owlTable', ['$http', '$rootScope', '$filter', '$modal', 'owlConstants', 'owlResource', 'owlUtils', 'owlFilter', owlTableService])
	.factory('owlResource', ['$http', 'owlConstants', owlResource])
	.service('owlUtils', ['owlConstants', owlUtils])
	.service('owlFilter', ['owlConstants', 'owlUtils', owlFilter]);
