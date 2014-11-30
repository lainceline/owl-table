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
		var focus;
		props.editable = props.column.editable || true;
		if (props.focusedCell) {
			focus = true;
		} else {
			focus = false;
		}
	//	var shouldBeFocused = props.focusedCell.find('input');

		if (props.open === true) {
			content = <OwlInput
						column={props.column}
						value={props.row[props.column.field]}
						row={props.row}
						shouldfocus={focus}
						tableDidChange={props.tableDidChange}
					/>;
		}

		return (
			<td data-field={props.column.field}>
				{props.editable === true ? content : (props.row[props.column.field] || '---')}
			</td>
		);
	},
	componentDidUpdate: function () {/*
		if (this.props.focusedCell !== false) {
			console.log('focusing');
			this.props.focusedCell.find('input').focus();
			this.props.focusedCell = false;
		}
	*/}
});
