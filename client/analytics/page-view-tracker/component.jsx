import React, { PropTypes } from 'react';

export const PageViewTracker = React.createClass( {
	getInitialState: () => ( {
		timer: null
	} ),

	componentDidMount() {
		this.queuePageView();
	},

	componentWillUnmount() {
		clearTimeout( this.state.timer );
	},

	queuePageView() {
		const {
			delay = 0,
			path,
			recorder,
			title
		} = this.props;

		if ( this.state.timer ) {
			return;
		}

		if ( ! delay ) {
			return this.setState(
				{ timer: true },
				recorder( path, title )
			);
		}

		this.setState( {
			timer: setTimeout( () => recorder( path, title ), delay )
		} );
	},

	render() {
		return this.props.children;
	}
} );

PageViewTracker.propTypes = {
	children: PropTypes.element.isRequired,
	delay: PropTypes.number,
	path: PropTypes.string.isRequired,
	recorder: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired
};

export default PageViewTracker;
