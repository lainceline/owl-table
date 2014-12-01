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
		var content = <span className="owl-cell-value-label">{props.row[props.column.field]}</span>;

		props.editable = props.column.editable || true;

		if (props.open === true) {
			content = <OwlInput
						column={props.column}
						value={props.row[props.column.field]}
						row={props.row}
						tableDidChange={props.tableDidChange}
					/>;
		}

		return (
			<td data-field={props.column.field}>
				{props.editable === true ? content : (props.row[props.column.field] || '---')}
			</td>
		);
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

					node.trigger('owlTableUpdated', [props.column, props.row, val]);
				});
			});
		}
	}
});
