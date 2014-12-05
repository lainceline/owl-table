var OwlCell = React.createClass({
	displayName: 'OwlCell',
	propTypes: {
		column: React.PropTypes.object.isRequired,
		row: React.PropTypes.object,
		open: React.PropTypes.bool,
		editable: React.PropTypes.bool
	},
	getDefaultProps: function () {
		return {
			open: false,
			editable: true
		};
	},
	render: function () {
		var props = this.props;
		var td;
		var content;
		var optionText;

		if (typeof props.row[props.column.field] === 'undefined') {
			return (
				<td></td>
			);
		}

		if (props.column.type.indexOf('select') > -1) {
			var split = _.compact(props.row[props.column.field].split('||'));

			var options;

			if (split.length > 1) {
				options =
					_(props.column.options)
					.filter(function (option) { if (_.contains(split, option.value)) { return true; } })
					.pluck('text').value().join(', ');
			} else {
				options = _(props.column.options).where({ 'value': props.row[props.column.field] }).first();
				if (typeof options !== 'undefined') {
					options = options.text;
				}
			}
			
			if (typeof options !== 'undefined') {
				optionText = options;
			} else {
				optionText = props.row[props.column.field];
			}

			content = <span className="owl-cell-value-label" dangerouslySetInnerHTML={{__html: optionText}}></span>;
		} else {
			content = <span className="owl-cell-value-label" dangerouslySetInnerHTML={{__html: props.row[props.column.field]}}></span>;
		}

		if (props.open === true) {
			content = <OwlInput
						column={props.column}
						value={props.row[props.column.field]}
						row={props.row}
						tableDidChange={props.tableDidChange}
					/>;
		}

		if (props.editable === true) {
			// refactor the cell and input class into each other in the future
			td =
				<td data-field={props.column.field}>
					{content}
				</td>;
		} else {
			td = <td data-field={props.column.field} dangerouslySetInnerHTML={{__html: props.row[props.column.field]}}></td>;
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

					var val = node.find('.swift-box-hidden-input').val();

					props.tableDidChange(event, props.row, props.column);

					node.trigger('owlTableUpdated', [props.column, props.row, val]);
				});
			});
		}
	}
});
