var OwlRow = React.createClass({
	displayName: 'OwlRow',
	propTypes: {
		data: React.PropTypes.object.isRequired,
		columns: React.PropTypes.array.isRequired,
		open: React.PropTypes.bool.isRequired,
		lockedCells: React.PropTypes.array
	},
	getInitialState: function () {
		return {
			open: false,
			focusedCell: false
		};
	},
	componentWillReceiveProps: function (newProps) {
		this.setState({
			open: newProps.open
		});
	},
	clickHandler: function (event) {
		var cell = $(event.target);
		// need to focus the input that was clicked
		if (event.target.nodeName !== 'TD') {
			cell = cell.closest('td');
		}

		this.setState({
			open: true,
			focusedCell: cell
		});
	},
	render: function () {
		var props = this.props;
		var state = this.state;

		var handler = this.clickHandler;

		var lockedCells = [];

		if (props.lockedCells) {
			lockedCells = props.lockedCells[props.data.id];

			if (lockedCells && lockedCells.constructor !== Array) {
				lockedCells = [lockedCells];
			} else {
				lockedCells = [];
			}
		}

		var cells = props.columns.map(function (column, index) {
			var editable = true && column.editable;

			if (lockedCells.length > 0) {
				lockedCells.forEach(function (locked, index) {
					/* jshint ignore:start */
					if (locked == column.field) {
						editable = false;
					}
					/* jshint ignore:end */
				});
			}

			var ref = 'column_' + index;

			if (column.visible !== false) {
				return (
					<OwlCell column={column} ref={ref} row={props.data} editable={editable} focusedCell={state.focusedCell} key={index} tableDidChange={props.tableDidChange} />
				);
			}
		});

		return(
			<tr className={props.className + " owl-row"} key={props.key}>
				{cells}
			</tr>
		);
	}
});
