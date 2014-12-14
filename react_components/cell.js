var OwlCell = React.createClass({
	displayName: 'OwlCell',
	propTypes: {
		column: React.PropTypes.object.isRequired,
		row: React.PropTypes.object,
		editable: React.PropTypes.bool
	},
	getDefaultProps: function () {
		return {
			open: false,
			editable: true
		};
	},
	getInitialState: function () {
		return {
			open: false
		};
	},
	open: function () {
		if (!this.state.open) {
			this.setState({
				open: true
			});
		}
	},
	render: function () {
		var props = this.props;
		var td;
		var content;
		var optionText;
		var value = props.row[props.column.field];
		var classes = 'owl-cell-value-label';

		if (typeof value === 'undefined') {
			value = props.row[props.column.field.toUpperCase()];
			if (typeof value === 'undefined') {
				value = props.row[props.column.field.toLowerCase()];
				if (typeof value === 'undefined') {
					return (
						<td>---</td>
					);
				}
			}
		}

		if (props.column.type.indexOf('select') > -1) {
			var split = [];
			var options;

			if (props.column.type === 'select_multiple') {
				split = _.compact(
					!props.row[props.column.field] ? props.row[props.column.field] : props.row[props.column.field].split('||')
				);
			}

			if (split.length > 1) {
				options =
					_(props.column.options)
					.filter(function (option) { if (_.contains(split, option.value)) { return true; } })
					.pluck('text').value().join(', ');
			} else {
				options = props.column.options.filter(function (option, index) {
					/* jshint ignore:start */
					// I want weak equality here.
					if (option.value == props.row[props.column.field]) {
						return true;
					}
					/* jshint ignore:end */
				});

				if (typeof options !== 'undefined' && options.length > 0) {
					options = options[0].text;
				} else {
					options = props.row[props.column.field];
					classes = classes + ' owl-invalid';
				}
			}

			if (typeof options !== 'undefined') {
				optionText = options;
			} else {
				optionText = props.row[props.column.field];
			}

			content = <span className={classes} dangerouslySetInnerHTML={{__html: optionText}}></span>;
		} else {
			content = <span className={classes} dangerouslySetInnerHTML={{ __html: value }}></span>;
		}

		if (this.state.open === true) {
			content = <OwlInput
						className={props.column.field}
						column={props.column}
						value={value}
						row={props.row}
						tableDidChange={props.tableDidChange}
					/>;
		}

		if (props.editable === true) {
			// refactor the cell and input class into each other in the future
			td =
				<td className={props.column.field} data-field={props.column.field} onClick={this.open}>
					{content}
				</td>;
		} else {
			td = <td className={props.column.field} data-field={props.column.field} dangerouslySetInnerHTML={{ __html: value }}></td>;
		}

		return td;
	},
	componentDidUpdate: function () {
		var self = this;

		if (this.props.focusedCell !== false) {
			this.props.focusedCell.find('input').focus();
		}

		var swiftboxes = $(this.getDOMNode()).find('.swiftbox');

		if (swiftboxes.length > 0) {
			swiftboxes.swiftbox();

			swiftboxes.each(function (index, box) {

				$(box).off('change');

				$(box).on('change', function (event) {
					var node = $(self.getDOMNode());
					var props = self.props;

					var val = $(box).swiftbox('value');

					if (props.column.type === 'select_multiple') {
						val = val.join('||');
					}

					event.target.value = val;

					props.tableDidChange(event, props.row, props.column);

					node.trigger('owlTableUpdated', [props.column, props.row, val]);
				});
			});
		}
	}
});
