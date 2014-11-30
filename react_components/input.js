//(function () {
	var OwlInput = React.createClass({
		displayName: 'OwlInput',
		propTypes: {
			column: React.PropTypes.object.isRequired,
			value: React.PropTypes.node,
			row: React.PropTypes.object
		},
		keydown: function (event) {
			// Handling the focus of the input myself with tab and shift-tab is
			// automatically handling readjusting the scroll position of the table,
			// unlike the default behavior.  See handler in table react component
			switch (event.which) {
				case 9:
					event.preventDefault();
					break;
				default:
					break;
			}
		},
		transmitSaveEvent: function (event) {
			var node = $(this.getDOMNode());
			var props = this.props;

			node.trigger('owlTableUpdated', [props.column, props.row, event.target.value]);
		},
		render: function () {
			var props = this.props;

			var input;
			var options = props.column.options;

			var self = this;

			switch (props.column.type) {
				case 'text':
				case 'number':
					input = <input type={props.column.type} onBlur={self.transmitSaveEvent} defaultValue={props.value} onKeyDown={self.keydown} onChange={self.inputDidChange}/>;
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
