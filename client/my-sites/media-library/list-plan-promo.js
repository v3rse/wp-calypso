/**
 * External dependencies
 */
var React = require( 'react' ),
	page = require( 'page' );

/**
 * Internal dependencies
 */
var EmptyContent = require( 'components/empty-content' ),
	Button = require( 'components/button' );

module.exports = React.createClass( {
	displayName: 'MediaLibraryListPlanPromo',

	propTypes: {
		site: React.PropTypes.object,
		filter: React.PropTypes.string
	},

	getTitle: function() {
		switch ( this.props.filter ) {
			case 'videos':
				return this.translate( 'Upload Videos', { textOnly: true, context: 'Media upload plan needed' } );
			case 'audio':
				return this.translate( 'Upload Audio', { textOnly: true, context: 'Media upload plan needed' } );
			default:
				return this.translate( 'Upload Media', { textOnly: true, context: 'Media upload plan needed' } );
		}
	},

	getSummary: function() {
		switch ( this.props.filter ) {
			case 'videos':
				return this.translate(
					'To upload video files to your site, upgrade your plan.',
					{ textOnly: true, context: 'Media upgrade promo' }
				);
			case 'audio':
				return this.translate(
					'To upload audio files to your site, upgrade your plan.',
					{ textOnly: true, context: 'Media upgrade promo' }
				);
			default:
				return this.translate(
					'To upload audio and video files to your site, upgrade your plan.',
					{ textOnly: true, context: 'Media upgrade promo' }
				);
		}
	},

	viewPlansPage: function() {
		const { slug = '' } = this.props.site;

		page( `/plans/${ slug }` );
	},

	render: function() {
		const action = (
			<Button className="button is-primary" onClick={ this.viewPlansPage }>{ this.translate( 'See Plans' ) }</Button>
		);

		return (
			<EmptyContent
				title={ this.getTitle() }
				line={ this.getSummary() }
				action={ action }
				illustration={ '' } />
		);
	}
} );
