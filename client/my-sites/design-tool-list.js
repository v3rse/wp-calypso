/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';

const ControlButton = props => (
	<div onClick={ props.onClick } className="design-menu-controls__control-button">
		<span className="design-menu-controls__control-button__title">{ props.title }</span>
		<Gridicon icon="chevron-right" size={ 24 } className="design-menu-controls__control-button__arrow" />
	</div>
);

const DesignToolList = React.createClass( {
	propTypes: {
		onChange: React.PropTypes.func.isRequired,
		tools: React.PropTypes.arrayOf( React.PropTypes.shape( {
			value: React.PropTypes.string.isRequired,
			label: React.PropTypes.string.isRequired,
		} ) ),
	},

	renderAllControls() {
		return this.props.tools.map( this.renderControl );
	},

	renderControl( tool ) {
		const onChange = () => this.props.onChange( tool.value )
		return <ControlButton key={ tool.value } title={ tool.label } onClick={ onChange } />;
	},

	render() {
		return (
			<div className="design-menu-controls__control-list">
				{ this.renderAllControls() }
			</div>
		);
	}
} );

export default DesignToolList;
