var OwlRow = React.createClass({
	displayName: 'OwlRow',
	propTypes: {
		data: React.PropTypes.object.isRequired,
		columns: React.PropTypes.array.isRequired,
		key: React.PropTypes.number.isRequired
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
				<OwlCell column={column} value={props.data[column.field]} open={state.open}/>
			);
		});

		return(
			<tr className="owl-row" key={props.key} onClick={this.clickHandler}>
				{cells}
			</tr>
		);
	}
});
