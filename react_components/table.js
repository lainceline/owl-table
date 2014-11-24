(function () {
	
	var OwlTable = React.createClass({
		displayName: 'OwlTable',
		propTypes: {
			data: React.PropTypes.array.isRequired,
			columns: React.PropTypes.array.isRequired
		},
		render: function () {

			var props = this.props;
			var count = 0;

			var headers = props.columns.map(function (column, index) {
				return (
					<th key={index} data-field={column.field}>
						{col.title || 'None'}
					</th>
				);
			});

			var rows = props.data.map(function (datum, index) {
				return (
					<OwlRow data={datum} columns={props.columns} key={index} />
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

})();
