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

		self.keyup = function (event) {
			console.log(event.nativeEvent);
			switch (event.which) {
				case 39:
					console.log('move to right');
					console.log($(event.nativeEvent.target));
					console.log($(event.target).parent().next());
					$(event.target).parent().next().children().focus();
					break;
				case 40:
					console.log('down');
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
