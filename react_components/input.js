//(function () {
	var OwlInput = React.createClass({
		displayName: 'OwlInput',
		propTypes: {
			column: React.PropTypes.object.isRequired,
			value: React.PropTypes.node
		},
		changeHandler: function (event) {
			console.log(event);
		},
		render: function () {
			var props = this.props;
			var input;
			var options = props.column.options;

			switch (props.column.type) {
				case 'text':
				case 'number':
					input = <input type={props.column.type} defaultValue={props.value} onChange={this.changeHandler} />;
					break;
				case 'select':
				case 'select_multiple':
					var optionList = options.map(function (option, index) {
						return (<option value={option.value}>{option.text}</option>);
					});
					input = <select value={props.value}>
								{optionList}
							</select>;
					break;
			}

			return input;
		}
	});
//})();
