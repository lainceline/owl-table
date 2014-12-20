var OwlTableReact = React.createClass({
	displayName: 'OwlTable',
	propTypes: {
		data: React.PropTypes.array.isRequired,
		columns: React.PropTypes.array.isRequired,
		childColumns: React.PropTypes.array,
		tacky: React.PropTypes.object,
		massUpdate: React.PropTypes.bool,
		pageChanged: React.PropTypes.bool,
		filteringEnabled: React.PropTypes.bool
	},
	tableDidChange: function (event, row, column) {
		if (typeof this.state.changedData[row.id] === 'undefined') {
			this.state.changedData[row.id] = {};
		}

		if (column.type.indexOf('select') === -1) {
			if (typeof event.target.value === 'function') {
				this.state.changedData[row.id][column.field] = event.target.value();
			} else {
				this.state.changedData[row.id][column.field] = event.target.value;
			}
		} else {
			this.state.changedData[row.id][column.field] = $(event.target).swiftbox('value');
		}
	},
	getDefaultProps: function () {
		return {
			tacky: {
				top: false,
				left: false
			},
			massUpdate: false,
			pageChanged: false,
			printMode: false,
			childColumns: []
		};
	},
	getInitialState: function () {
		return {
			changedData: {},
			openRows: {},
			sortReverse: false,
			sorted: false
		};
	},
	componentDidUpdate: function () {
		if (this.props.tacky) {
			$('.tacky').tacky();
		}
	},
	componentWillReceiveProps: function (newProps) {
		if (newProps.pageChanged === true) {
			this.setState({
				openRows: {}
			});
		}
	},
	sortClickHandler: function (field, event) {
		var state = this.state;
		var sortReverse = state.sortReverse;

		if (state.sorted === false) {
			this.setState({sorted: true}, function () {
				this.props.sortClickHandler(field, sortReverse);
			});
		} else {
			// flip the sort order
			sortReverse = !sortReverse;
			this.setState({sortReverse: sortReverse});
			this.props.sortClickHandler(field, sortReverse);
		}
	},
	filterFieldChanged: function (filter, event) {
		event.persist();
		var self = this;
		_.debounce(
			function (filter, event) {
				event.persist();
				filter.term = event.target.value;
				self.props.filterDidChange(filter);
			}, 200
		)(filter, event);
	},
	keyup: function (event) {
		var td = $(event.target).parent();
		var handled = false;

		switch (event.which) {
			case 9:
				if (event.shiftKey !== true) {
					td.next().children().focus();
				} else {
					td.prev().children().focus();
				}
				handled = true;
				break;
			default:
				break;
		}

		if (handled === true) {
			event.stopPropagation();
		}
	},
	render: function () {
		var self = this;

		var props = self.props;
		var tackyTop = false;
		var tackyLeft = false;

		if (props.tacky) {
			if (props.tacky.top) {
				tackyTop = true;
			}

			if (props.tacky.left) {
				tackyLeft = props.tacky.left;
			}
		}

		var filterSection;
		var filters;

		if (props.filteringEnabled) {
			filters = props.columns.map(function (column, index) {
				if (typeof column.filters === 'undefined') {
					column.filters = [{
						predicate: '',
						type: 'contains'
					}];
				}
				// For each column, create a div with an input for each filter
				var colFilters = column.filters.map(function (filter, index) {
					return (
						<div key={index} className="owl-filter">
							<div onClick={props.addFilter.bind(this, column)} className='owl-filter-button owl-filter-button-add' />
							<input type="text" className="owl-filter-input" onChange={self.filterFieldChanged.bind(null, filter)} defaultValue={filter.predicate} />
							<div className="owl-change-filter-type" />
						</div>
					);
				});

				var tackyLeft = '';
				if (isTackyLeft(column)) {
					tackyLeft = ' tacky-left';
				}

				return (
					<th key={index} className={"tacky-top" + tackyLeft}>
						<div className="owl-filter-wrapper">
							{colFilters}
						</div>
					</th>
				);
			});

			filterSection = <tr className="owl-filter-row"> {filters} </tr>;
		}

		function isTackyLeft (column) {
			return typeof column.tacky !== 'undefined' && column.tacky.left === true;
		}

		var headerCount = -1;

		var headers = props.columns.map(function (column, index) {
			var classes = 'owl-table-sortElement';
			var id = 'owl_header_' + column.field;
			if (tackyTop) {
				classes = classes + ' tacky-top';
			}

			if (isTackyLeft(column)) {
				classes = classes + ' tacky-left';
			}

			headerCount++;

			if (column.visible !== false) {
				return (
					<th onClick={_.partial(self.sortClickHandler, column.field)} className={classes} id={id} key={headerCount} data-field={column.field}>
						{column.title || 'None'}
					</th>
				);
			}
		});

		if (props.childColumns.length > 0) {
			_.forEach(props.childColumns, function (child, index) {
				var id = 'owl_child_header_' + child.field;
				var classes = '';

				if (tackyTop) {
					classes = 'tacky-top';
				}

				if (child.visible !== false) {
					headerCount++;
					headers.push(
						<th className={classes} key={headerCount} id={id} data-field={child.field}>
							{child.title || 'None'}
						</th>
					);
				}
			});
		}

		var rowsWithChildren = [];
		var rowCount = 0;

		_.forEach(props.data, function (row, index) {
			var children = row.children;

			rowsWithChildren.push(
				<OwlRow
					data={row}
					columns={props.columns}
					childColumns={props.childColumns}
					key={rowCount}
					open={self.state.openRows[index] || false}
					tableDidChange={self.tableDidChange}
				/>
			);

			rowCount++;

			if (!_.isUndefined(children) && _.isArray(children)) {
				_.forEach(children, function (child, index) {

					rowsWithChildren.push(
						<OwlRow data={child} isChild={true} childColumns={props.childColumns} columns={props.columns} key={rowCount} open={self.state.openRows[index] || false} tableDidChange={self.tableDidChange} />
					);
					rowCount++;
				});
			}
		});

		var classes = 'owl-table tacky';
		if (props.printMode !== false) {
			classes = classes + ' owl-table-print';
		}

		return (
			<table onKeyUp={self.keyup} id="owl-table" className={classes}>
				<thead>
					{filterSection}
					<tr>
						{headers}
					</tr>
				</thead>
				<tbody className="tbody">
					{rowsWithChildren}
				</tbody>
			</table>
		);
	}
});
