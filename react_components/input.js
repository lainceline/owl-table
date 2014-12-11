//(function () {
	var OwlInput = React.createClass({
		displayName: 'OwlInput',
		propTypes: {
			column: React.PropTypes.object.isRequired,
			value: React.PropTypes.node,
			row: React.PropTypes.object,
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
		inputDidChange: function (event) {
			event.persist();
			this.debouncedInputDidChange(event);
		},
		debouncedInputDidChange: _.debounce(function (event) {
			this.props.tableDidChange(event, this.props.row, this.props.column);
		}, 200),
		transmitSaveEvent: function (event) {
			var node = $(this.getDOMNode());
			var props = this.props;
			var newValue = event.target.value;

			if (props.column.type === 'checkbox') {
				newValue = this.refs.checkbox.getDOMNode().checked ? 'Y' : 'N';
			}

			node.trigger('owlTableUpdated', [props.column, props.row, newValue]);
		},
		handleSpecialFields: function (event) {
			event.persist();
			this.props.tableDidChange(event, this.props.row, this.props.column);
			this.transmitSaveEvent(event);
		},
		render: function () {
			var props = this.props;

			var input;
			var options = props.column.options;

			var self = this;

			var optionList;

			// refactor this into factory that makes subcomponents
			// That way we could swap factories out - the below field logic is tailored
			// to legacy code.
			switch (props.column.type) {
				case 'text':
				case 'number':
					input = <input className="owl-input" type={props.column.type} onBlur={self.transmitSaveEvent} defaultValue={props.value} onKeyDown={self.keydown} onChange={self.inputDidChange}/>;
					break;
				case 'select': // fall through
				case 'select_one': // fall through
				case 'select_multiple':
					optionList = options.map(function (option, index) {
						var textVal = $('<p>').html(option.text).text();
						return (
							<option key={index} value={option.value}>
								{textVal}
							</option>
						);
					});

					if (props.column.type === 'select_multiple') {
						input = <select onChange={self.inputDidChange} className="swiftbox" multiple={true} defaultValue={ !props.value ? props.value : props.value.split("||")}>
									{optionList}
								</select>;
					} else {
						input = <select onChange={self.inputDidChange} className="swiftbox" defaultValue={props.value}>
									{optionList}
								</select>;
					}
					break;
				case 'checkbox':
					input = <label className="owl-check-label">
								<input ref="checkbox" className="owl-input" type="checkbox" onChange={self.handleSpecialFields} value='Y' defaultChecked={ props.value ? true : false } />
							</label>;
					break;
				case 'radio':
					var radioName = props.column.field + '_' + props.row.id;
					optionList = options.map(function (option, index) {
						return (
							<div key={index} className="radio">
								<label>
									<input className="owl-input" type="radio" onChange={self.transmitSaveEvent} defaultValue={option.value} name={radioName} />
									{option.text}
								</label>
							</div>
						);
					});

					input = <div>{optionList}</div>;
					break;
				case 'date':
					input =
						<input className="owl-input" defaultValue={props.value} data-date-format="dd-M-yy" data-provide="datepicker"/>;
					break;
				case 'time':
					input = <input className="owl-input" type="time" onChange={self.handleSpecialFields} defaultValue={props.value} />;
					break;
				case 'file':
					input = <span> File upload not supported yet </span>;
					break;
				case 'log':
					input = <span> Log field not supported yet </span>;
					break;
				case 'placeholder':
					input = <span> Placeholder </span>;
					break;
				default:
					input = <span> {props.value} </span>;
					console.error('Invalid field type "' + props.column.type + '" for field ' + props.column.field);
			}

			return input;
		},
		componentDidMount: function () {
			var self = this;
			if (self.props.column.type === 'date') {
				$(self.getDOMNode()).on('changeDate', function (date) {
					date.target.value = date.format().toUpperCase();
					self.props.tableDidChange(date, self.props.row, self.props.column);
					self.transmitSaveEvent(date);
				});
			}
		},
		componentDidUpdate: function () {
			var self = this;
			if (self.props.column.type === 'date') {
				$(self.getDOMNode()).on('changeData', function (date) {
					date.target.value = date.format().toUpperCase();
					self.props.tableDidChange(date, self.props.row, self.props.column);
					self.transmitSaveEvent(date);
				});
			}
		}
	});
//})();
