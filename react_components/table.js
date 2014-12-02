var OwlTableReact = React.createClass({
	displayName: 'OwlTable',
	propTypes: {
		data: React.PropTypes.array.isRequired,
		columns: React.PropTypes.array.isRequired,
		tacky: React.PropTypes.object,
		lockedCells: React.PropTypes.array
	},
	getInitialState: function () {
		return {
			changedData: {},
			openRows: {}
		};
	},
	componentDidUpdate: function () {
		if (this.props.tacky) {
			$('.tacky').tacky();
		}
	},
	render: function () {
		var self = this;

		var props = self.props;
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

		var rows = props.data.map(function (datum, index) {

			var lockedForRow = _.find(props.lockedCells, function (value, index) {
				if (parseInt(Object.keys(value)[0]) === datum.id) {
					return true;
				}
			});

			return (
				<OwlRow data={datum} lockedCells={lockedForRow} columns={props.columns} key={index} open={self.state.openRows[index] || false} tableDidChange={self.tableDidChange} />
			);
		});

		self.keyup = function (event) {
			var td = $(event.target).parent();
			var handled = false;

			switch (event.which) {
				case 9:
					if (event.shiftKey !== true) {
						td.next().children().focus();
					} else {
						td.prev().children().focus();
					}
					handled = true;
					break;
				default:
					break;
			}

			if (handled === true) {
				event.stopPropagation();
			}
		};

		return (
			<table onKeyUp={self.keyup} className="owl-table">
				<thead>
					<tr>
					{headers}
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</table>
		);
	}
});
