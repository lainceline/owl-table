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

			var optionList;

			switch (props.column.type) {
				case 'text':
				case 'number':
					input = <input type={props.column.type} onBlur={self.transmitSaveEvent} defaultValue={props.value} onKeyDown={self.keydown} onChange={self.inputDidChange}/>;
					break;
				case 'select': // fall through
				case 'select_one': // fall through
				case 'select_multiple':
					optionList = options.map(function (option, index) {
						return (
							<option key={index} value={option.value}>
								{option.text}
							</option>
						);
					});

					if (props.column.type === 'select_multiple') {
						input = <select className="swiftbox" multiple={true} defaultValue={props.value.split("||")}>
									{optionList}
								</select>;
					} else {
						input = <select className="swiftbox" defaultValue={props.value}>
									{optionList}
								</select>;
					}
					break;
				case 'radio':
					var radioName = props.column.field + '_' + props.row.id;
					optionList = options.map(function (option, index) {

						return (
							<div key={index} className="radio">
								<label>
									<input type="radio" onChange={self.transmitSaveEvent} defaultValue={option.value} name={radioName} />
									{option.text}
								</label>
							</div>
						);
					});

					input = <div>{optionList}</div>;
					break;
				default:
					break;
			}

			return input;
		}
	});
//})();
