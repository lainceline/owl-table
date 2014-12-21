(function (angular, _, $) {
'use strict';

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
	return {

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

			var term = this.getTerm(filter);

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

			if (filter.condition === 8 || filter.condition === 32) {
				filter.term = 'foo';
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
			} else if (conditionType === 'function') {
				return filter.condition(term, value, row, column);
			} else if (filter.condition === owlConstants.filtering.STARTS_WITH) {
				var startswithRE = termCache(cacheId) ? termCache(cacheId) : termCache(cacheId, new RegExp('^' + term, regexpFlags));

				if (!startswithRE.test(value)) {
					return false;
				}
			} else if (filter.condition === owlConstants.filtering.ENDS_WITH) {
				var endswithRE = termCache(cacheId) ? termCache(cacheId) : termCache(cacheId, new RegExp(term + '$', regexpFlags));

				if (!endswithRE.test(value)) {
					return false;
				}
			} else if (filter.condition === 8) {
				if (value.length !== 0) {
					return false;
				}
			} else if (filter.condition === owlConstants.filtering.CONTAINS) {
				var containsRE = termCache(cacheId) ? termCache(cacheId) : termCache(cacheId, new RegExp(term, regexpFlags));

				if (!containsRE.test(value)) {
					return false;
				}
			} else if (filter.condition === owlConstants.filtering.NOT_EMPTY) {
				if (value.length === 0) {
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
				if (filters.hasOwnProperty(i)) {
					var filter = filters[i];

					if (this.filterCell(row, column, termCache, i, filter) === true) {
						return true;
					}
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

			angular.forEach(columns, function (column) {
				if (typeof column.filters !== 'undefined' && column.filters.length > 0 && typeof column.filters[0].term !== 'undefined' && column.filters[0].term) {
					filterCols.push(column);
				} else if (typeof column.filters !== 'undefined' && column.filters && typeof column.filters[0].term !== 'undefined' && column.filters[0].term) {
					// Don't ask, cause I don't know.
					filterCols.push(column);
				} else if (typeof column.filters !== 'undefined' && (column.filters[0].condition === 8 || column.filters[0].condition === 32)) {
					filterCols.push(column);
				}
			});

			var rowShouldBeThere = false;

			if (filterCols.length > 0) {
				angular.forEach(rows, function forEachRow (row) {
					rowShouldBeThere = true;
					angular.forEach(filterCols, function forEachColumn (col) {
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
}

angular.module('owlTable')
	.service('owlFilter', ['owlConstants', 'owlUtils', owlFilter]);

})(window.angular, window._, window.jQuery);
