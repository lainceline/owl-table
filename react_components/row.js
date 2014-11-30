var OwlRow = React.createClass({
	displayName: 'OwlRow',
	propTypes: {
		data: React.PropTypes.object.isRequired,
		columns: React.PropTypes.array.isRequired,
		open: React.PropTypes.bool.isRequired
	},
	getInitialState: function () {
		return {
			open: false,
			focusedCell: false
		};
	},
	clickHandler: function (event) {
		console.log(event.target);
		var cell = $(event.target);
		// need to focus the input that was clicked
		//console.log(event.target.nodeName);
		if (event.target.nodeName !== 'TD') {
			cell = cell.closest('td');
		}
		//console.log(cell);
		//console.log(cell.children());
		//cell.find('input').focus();

		this.setState({
			open: true,
			focusedCell: cell
		});
	},
	render: function () {
		var props = this.props;
		var state = this.state;

		var handler = this.clickHandler;

		//console.log(state);

		var cells = props.columns.map(function (column, index) {
			return (
				<OwlCell column={column} row={props.data} focusedCell={state.focusedCell} open={props.open || state.open} key={index} tableDidChange={props.tableDidChange}/>
			);
		});

		return(
			<tr className="owl-row" key={props.key} onClick={this.clickHandler}>
				{cells}
			</tr>
		);
	}
});
