var OwlRow = React.createClass({
	displayName: 'OwlRow',
	propTypes: {
		data: React.PropTypes.object.isRequired,
		columns: React.PropTypes.array.isRequired,
		key: React.PropTypes.number.isRequired
	},
	render: function () {
		var props = this.props;

		var cells = props.columns.map(function (column, index) {
			return (
				<td key={index} data-field={column.field}>
					{props.data[column.field] || '---'}
				</td>
			);
		});

		return(
			<tr className="owl-row" key={props.key}>
				{cells}
			</tr>
		);
	}
});
