var OwlTableReact = React.createClass({
	displayName: 'OwlTable',
	propTypes: {
		data: React.PropTypes.array.isRequired,
		columns: React.PropTypes.array.isRequired,
		tacky: React.PropTypes.object
	},
	getInitialState: function () {
		return {
			changedData: {},
			openRows: {}
		};
	},
	componentDidMount: function () {

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
		console.log(self.state.openRows);
		var rows = props.data.map(function (datum, index) {
			return (
				<OwlRow data={datum} columns={props.columns} key={index} open={self.state.openRows[index] || false} tableDidChange={self.tableDidChange} />
			);
		});

		self.keyup = function (event) {
			var td = $(event.target).parent();
			var newState;

			switch (event.which) {
				case 39:
					td.next().children().focus();
					break;
				case 40:
					// Need to open the row and then focus the input with the same offset as this one
					newState = React.addons.update(self.state, {
						openRows: {
							$apply: function (rows) {
								console.log(td.parent());
								rows[td.parent()[0].sectionRowIndex + 1] = true;
								return rows;
							}
						}
					});

					self.setState(newState);

					td.parent().on('inputadded',  function () {
						console.log('ready');
						console.log($(this));
						var self = $(this);
						console.log($(self.next().children('td')[td[0].cellIndex]).find('input'));
						$(self.next().children('td')[td[0].cellIndex]).find('input').focus();
						self.off('inputadded');
					});
					break;
				case 41:
					td.prev().children().focus();
					break;
				case 42:

					break;
				default:
					break;
			}
			event.stopPropagation();
		};

		return (
			<table onKeyUp={self.keyup} className="owl-table">
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
