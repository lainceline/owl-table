var OwlCell = React.createClass({
	displayName: 'OwlCell',
	propTypes: {
		column: React.PropTypes.object.isRequired,
		value: React.PropTypes.node,
		open: React.PropTypes.bool,
		editable: React.PropTypes.bool
	},
	getDefaultProps: function () {
		return {
			value: '',
			open: false,
			editable: true
		};
	},
	changeHandler: function (event) {
	//	console.log(event.target);
	//	console.log(this.props.value);
	},
	render: function () {
		var props = this.props;
		var content = <span className="owl-cell-value-label">{props.value}</span>;

		props.editable = props.column.editable || true;

		if (props.open === true) {
			content = <OwlInput column={props.column} value={props.value} />;
		}

		return (
			<td data-field={props.column.field}>
				{props.editable === true ? content : (props.value || '---')}
			</td>
		);
	}
});
