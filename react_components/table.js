var OwlTableReact = React.createClass({
	displayName: 'OwlTable',
	propTypes: {
		data: React.PropTypes.array.isRequired,
		columns: React.PropTypes.array.isRequired,
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
			pageChanged: false
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
						<span key={index} className="owl-filter">
							<div onClick={props.addFilter.bind(this, column)} className='owl-filter-button owl-filter-button-add' />
							<input type="text" onChange={self.filterFieldChanged.bind(null, filter)} defaultValue={filter.predicate} />
						</span>
					);
				});
				//var tackyLeft = column.field === 'custom_2000000' ? ' tacky-left' : '';
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

		var isTackyLeft = function (column) {
			return typeof column.tacky !== 'undefined' && column.tacky.left === true;
		};

		var headers = props.columns.map(function (column, index) {
			var classes = 'owl-table-sortElement';
			var id = 'owl_header_' + column.field;
			if (tackyTop) {
				classes = classes + ' tacky-top';
			}

			if (isTackyLeft(column)) {
				classes = classes + ' tacky-left';
			}

			if (column.visible !== false) {
				return (
					<th className={classes} id={id} key={index} data-field={column.field}>
						{column.title || 'None'}
						<i onClick={_.partial(self.sortClickHandler, column.field)} className='glyphicon glyphicon-sort' />
					</th>
				);
			}
		});

		var rows = props.data.map(function (datum, index) {
			return (
				<OwlRow data={datum} columns={props.columns} key={index} open={self.state.openRows[index] || false} tableDidChange={self.tableDidChange} />
			);
		});

		self.keyup = function (event) {
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
		};

		return (
			<table onKeyUp={self.keyup} className="owl-table tacky">
				<thead>
					{filterSection}
					<tr>
						{headers}
					</tr>
				</thead>
				<tbody className="tbody">
					{rows}
				</tbody>
			</table>
		);
	}
});
