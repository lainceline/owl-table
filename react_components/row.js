var OwlRow = React.createClass({
	displayName: 'OwlRow',
	propTypes: {
		data: React.PropTypes.object.isRequired,
		columns: React.PropTypes.array.isRequired
	},
	getInitialState: function () {
		return {
			open: false
		};
	},
	clickHandler: function (event) {
		this.setState({open: true});
	},
	render: function () {
		var props = this.props;
		var state = this.state;

		var handler = this.clickHandler;

		var cells = props.columns.map(function (column, index) {
			return (
				<OwlCell column={column} row={props.data} open={state.open} key={index} tableDidChange={props.tableDidChange}/>
			);
		});

		return(
			<tr className="owl-row" key={props.key} onClick={this.clickHandler}>
				{cells}
			</tr>
		);
	}
});
