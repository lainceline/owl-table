//(function () {
	var OwlInput = React.createClass({
		displayName: 'OwlInput',
		propTypes: {
			column: React.PropTypes.object.isRequired,
			value: React.PropTypes.node,
			row: React.PropTypes.object
		},
		inputDidChange: function (event) {
			event.persist();
			this.debouncedInputChange(event);
		},
		debouncedInputChange: _.debounce(function (event) {
			var node = $(this.getDOMNode());
			var props = this.props;

			node.trigger('owlTableUpdated', [props.column, props.row, event.target.value]);
		}, 500),
		render: function () {
			var props = this.props;

			var input;
			var options = props.column.options;

			var self = this;

			switch (props.column.type) {
				case 'text':
				case 'number':
					input = <input type={props.column.type} defaultValue={props.value} onChange={self.inputDidChange}/>;
					break;
				case 'select':
				case 'select_multiple':
					var optionList = options.map(function (option, index) {
						return (
							<option value={option.value}>
								{option.text}
							</option>
						);
					});
					input = <select value={props.value}>
								{optionList}
							</select>;
					break;
				default:
					break;
			}

			return input;
		}
	});
//})();
