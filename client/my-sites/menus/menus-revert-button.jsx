/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import debugFactory from 'debug';

const debug = debugFactory( 'calypso:menus:revert-button' ); // eslint-disable-line no-unused-vars

const MenuRevertButton = React.createClass( {
	componentWillMount() {
		this.props.menuData.on( 'saved', this.setReverted );
		this.props.menuData.on( 'error', this.setReverted );
	},

	componentWillUnmount() {
		this.props.menuData.off( 'saved', this.setReverted );
		this.props.menuData.off( 'error', this.setReverted );
	},

	getInitialState() {
		return { reverting: false };
	},

	setReverting() {
		this.setState( { reverting: true } );
	},

	setReverted() {
		this.setState( { reverting: false } );
	},

	revert() {
		this.setReverting();
		return this.props.menuData.discard();
	},

	render() {
		const hasChanged = this.props.menuData.get().hasChanged,
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

export default MenuRevertButton;
