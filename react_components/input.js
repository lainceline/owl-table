//(function () {
	var OwlInput = React.createClass({
		displayName: 'OwlInput',
		propTypes: {
			column: React.PropTypes.object.isRequired,
			value: React.PropTypes.node
		},
		changeHandler: function handleTextChange (event) {
			console.log(event);
		},
		render: function () {
			var props = this.props;

			return (
				<input type={props.column.type} defaultValue={props.value} />
			);
		}
	});
//})();
