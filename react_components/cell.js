var OwlCell = React.createClass({
	displayName: 'OwlCell',
	propTypes: {
		column: React.PropTypes.object.isRequired,
		row: React.PropTypes.object,
		open: React.PropTypes.bool,
		editable: React.PropTypes.bool
	},
	getDefaultProps: function () {
		return {
			open: false,
			editable: true
		};
	},
	render: function () {
		var props = this.props;
		var content = <span className="owl-cell-value-label">{props.row[props.column.field]}</span>;

		props.editable = props.column.editable || true;

		if (props.open === true) {
			content = <OwlInput
						column={props.column}
						value={props.row[props.column.field]}
						row={props.row}
						tableDidChange={props.tableDidChange}
					/>;
		}

		return (
			<td data-field={props.column.field}>
				{props.editable === true ? content : (props.row[props.column.field] || '---')}
			</td>
		);
	},
	componentDidUpdate: function () {
		console.log(this.props.focusedCell);
		if (this.props.focusedCell) {
		this.props.focusedCell.find('input').focus();
	}
	}
});
