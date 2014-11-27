var OwlTableReact = React.createClass({
	displayName: 'OwlTable',
	propTypes: {
		data: React.PropTypes.array.isRequired,
		columns: React.PropTypes.array.isRequired
	},
	getInitialState: function () {
		return {
			changedData: {}
		};
	},
	componentDidMount: function () {
		var self = this;

		$(self.getDOMNode()).on('owlTableUpdated', function (event, column, row, value) {
			var newChangedData = self.state.changedData;

			newChangedData[row.id] = row;

			newChangedData[row.id][column.field] = value;

			self.setState({
				changedData: newChangedData
			});

			// This will set event.result to the changed row, so when the event
			// bubbles up to the angular controller we can save it.
			return row;
		});
	},
	render: function () {
		var props = this.props;

		var headers = props.columns.map(function (column, index) {
			return (
				<th key={index} data-field={column.field}>
					{column.title || 'None'}
				</th>
			);
		});

		var self = this;

		var rows = props.data.map(function (datum, index) {
			return (
				<OwlRow data={datum} columns={props.columns} key={index} tableDidChange={self.tableDidChange} />
			);
		});

		return (
			<table className="owl-table">
				<thead>
					{headers}
				</thead>
				<tbody>
					{rows}
				</tbody>
			</table>
		);
	}
});
