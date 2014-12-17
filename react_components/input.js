//(function () {
	var OwlInput = React.createClass({
		displayName: 'OwlInput',
		propTypes: {
			column: React.PropTypes.object.isRequired,
			row: React.PropTypes.object,
		},
		keydown: function (event) {
			var node = $(this.getDOMNode());
			event.persist();
			if (this.props.column.type === 'number') {
				if (/\D/.test(String.fromCharCode(event.which))) {
					// invalid
					event.preventDefault();
					node.tooltip('show');
				} else {
					node.tooltip('hide');
				}
			}
			// See handler in table react component
			switch (event.which) {
				case 9:
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

			node.trigger('owlTableUpdated', [props.column, props.row, newValue]);

			if (props.column.type !== 'checkbox') {
				this.props.closeCell();
			}
		},
		handleSpecialFields: function (event) {
			event.persist();
			this.props.tableDidChange(event, this.props.row, this.props.column);
			this.transmitSaveEvent(event);
		},
		handleCheckboxChange: function (event) {
			event.persist();

			var newValue = this.refs.checkbox.getDOMNode().checked ? 'Y' : 'N';
			event.target.value = newValue;
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
			var classNames = 'owl-input';
			switch (props.column.type) {
				case 'number':
				case 'text':
					var containerTd = 'td[data-field="' + props.column.field + '"]';
					input = <input className={classNames} data-container="body" data-toggle="tooltip" data-trigger="click" data-placement="right" title="Numbers only" type="text" onBlur={self.transmitSaveEvent} defaultValue={props.value} onKeyPress={self.keydown} formNoValidate={true} noValidate={true} onChange={self.inputDidChange}/>;
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
								<input ref="checkbox" className="owl-input" type="checkbox" onChange={self.handleCheckboxChange} value='Y' defaultChecked={ props.value ? true : false } />
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
						<input className="owl-input" defaultValue={props.value} data-date-format="mm/dd/yyyy" data-provide="datepicker"/>;
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

			$(self.getDOMNode()).focus();

			if (self.props.column.type === 'date') {
				$(self.getDOMNode()).on('changeDate', function (date) {
					date.target.value = date.format().toUpperCase();
					self.props.tableDidChange(date, self.props.row, self.props.column);
					self.transmitSaveEvent(date);
				});
			}

			if (self.props.column.type === 'number') {
				$(self.getDOMNode()).tooltip();
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
