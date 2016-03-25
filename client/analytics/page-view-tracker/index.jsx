import React, { PropTypes } from 'react';

import analytics from 'analytics';
import PageViewTracker from './component';

const recorder = ( path, title ) => analytics.pageView( path, title );

export const Wrapper = React.createClass( {
	render() {
		const {
			children,
			delay = 0,
			path,
			title
		} = this.props;

		return (
			<PageViewTracker { ...{ path, title, delay, recorder } }>
				{ children }
			</PageViewTracker>
		);
	}
} );

Wrapper.propTypes = {
	children: PropTypes.element.isRequired,
	delay: PropTypes.number,
	path: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired
};

export default Wrapper;
