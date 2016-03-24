/**
 * External dependencies
 */
var React = require( 'react' ),
	classNames = require( 'classnames' ),
	debug = require( 'debug' )( 'calypso:menus:revert-button' ); // eslint-disable-line no-unused-vars

var MenuRevertButton = React.createClass( {
	componentWillMount: function() {
		this.props.menuData.on( 'saved', this.setReverted );
		this.props.menuData.on( 'error', this.setReverted );
	},

	componentWillUnmount: function() {
		this.props.menuData.off( 'saved', this.setReverted );
		this.props.menuData.off( 'error', this.setReverted );
	},

	getInitialState: function() {
		return { reverting: false };
	},

	setReverting: function() {
		this.setState( { reverting: true } );
	},

	setReverted: function() {
		this.setState( { reverting: false } );
	},

	revert: function() {
		this.setReverting();
		return this.props.menuData.discard();
	},

	render: function() {
		var hasChanged = this.props.menuData.get().hasChanged,
			classes = classNames( {
				button: true,
				'is-primary': true,
			} );

		return (
			<button className={ classes }
					disabled={ ! hasChanged }
					onClick={ this.revert }>
				{ this.state.reverting ? this.translate( 'Canceling…' ) : this.translate( 'Cancel' ) }
			</button>
		);
	}
} );

module.exports = MenuRevertButton;
