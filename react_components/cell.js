var OwlCell = React.createClass({
	displayName: 'OwlCell',
	propTypes: {
		column: React.PropTypes.object.isRequired,
		value: React.PropTypes.node
	},
	render: function () {

		var props = this.props;

		if (typeof(props.value) === 'undefined') {
			props.value = '';
		}

		return (
			<td data-field={props.column.field}>
				{props.value || '---'}
			</td>
		);
	}
});
