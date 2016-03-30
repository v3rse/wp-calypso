import React, { PropTypes } from 'react';

import FoldableCard from 'components/foldable-card';
import Gridicon from 'components/gridicon';

import StandardPlugin from './plugin-types/standard-plugin';
import standardPlugins from './standard-plugins';

export const StandardPluginsPanel = React.createClass( {
	render() {
		const { plugins: givenPlugins = [] } = this.props;
		const plugins = givenPlugins.length
			? givenPlugins
			: standardPlugins;
		const actionButton = <div className="wpcom-plugins__action-button"><Gridicon icon="checkmark" /> Active</div>;

		return (
			<FoldableCard
				actionButton={ actionButton }
				actionButtonExpanded={ actionButton }
				className="wpcom-plugins__standard-panel"
				expanded={ true }
				header="Standard Plugin Suite"
			>
				{ plugins.map( ( { name, supportLink, icon, category, description } ) =>
					<StandardPlugin
						{ ...{ name, key: name, supportLink, icon, category, description } }
					/>
				) }
				<div>
					<Gridicon icon="plus" />View all standard plugins
				</div>
			</FoldableCard>
		);
	}
} );

StandardPluginsPanel.propTypes = {
	plugins: PropTypes.array
};

export default StandardPluginsPanel;
