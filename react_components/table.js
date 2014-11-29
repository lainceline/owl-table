var OwlTableReact = React.createClass({
	displayName: 'OwlTable',
	propTypes: {
		data: React.PropTypes.array.isRequired,
		columns: React.PropTypes.array.isRequired,
		tacky: React.PropTypes.object
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
	componentDidUpdate: function () {
		if (this.props.tacky) {
			$('.tacky').tacky();
		}
	},
	render: function () {
		var props = this.props;
		var tackyTop = false;
		var tackyLeft = false;

		if (props.tacky) {
			if (props.tacky.top) {
				tackyTop = true;
			}

			if (props.tacky.left) {
				tackyLeft = props.tacky.left;
			}
		}

		var headers = props.columns.map(function (column, index) {
			return (
				<th className={tackyTop ? 'tacky-top' : ''} key={index} data-field={column.field}>
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
