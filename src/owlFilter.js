(function () {

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

function owlFilter (owlConstants, owlUtils) {
	var filterService = {

		hasNoFilters: function (columns) {
			return _.every(columns, function (column) {
				var ret = false;
				if (_.isEmpty(column.filters)) {
					ret = true;
				} else {
					ret = _.every(column.filters, function (filter) {
						return typeof filter.term === 'undefined' || filter.term === '' ;
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
							rowShouldBeThere = false;
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

angular.module('owlTable').service('owlFilter', ['owlConstants', 'owlUtils', owlFilter]);

})();
