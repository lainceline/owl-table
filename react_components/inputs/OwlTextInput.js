var OwlTextInput = React.createClass({
	displayName: 'OwlTextInput',
	getDefaultProps: function () {
		return {
			onChange: function () {},
			cell: {
				recordId: '',
				columnField: ''
			}
		};
	},
	render: function () {
		return <input type="text" {...this.props} onChange={this.props.onChange.bind(this, this.props.cell)} />;
	}
});
