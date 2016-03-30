/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-pure-render/mixin';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import noop from 'lodash/noop';
import { translate } from 'lib/mixins/i18n';
import page from 'page';

/**
 * Internal dependencies
 */
import { getSelectedSite } from 'state/ui/selectors';
import { getEditedPost } from 'state/posts/selectors';
import { getPostType } from 'state/post-types/selectors';
import { getEditorPostId, isEditorDraftsVisible } from 'state/ui/editor/selectors';
import { toggleEditorDraftsVisible } from 'state/ui/editor/actions';
import Button from 'components/button';
import Gridicon from 'components/gridicon';
import DraftsButton from 'post-editor/drafts-button';
import PostCountsData from 'components/data/post-counts-data';
import QueryPostTypes from 'components/data/query-post-types';

const EditorSidebarHeader = React.createClass( {
	displayName: 'EditorSidebarHeader',

	mixins: [ PureRenderMixin ],

	propTypes: {
		typeSlug: PropTypes.string,
		type: PropTypes.object,
		siteId: PropTypes.number,
		allPostsUrl: PropTypes.string,
		showDrafts: PropTypes.bool,
		toggleDrafts: PropTypes.func
	},

	getDefaultProps() {
		return {
			showDrafts: false,
			toggleDrafts: noop
		};
	},

	render() {
		const isCustomPostType = ( 'post' !== this.props.typeSlug && 'page' !== this.props.typeSlug );
		const className = classnames( 'editor-sidebar__header', {
			'is-drafts-visible': this.props.showDrafts,
			'is-loading': isCustomPostType && ! this.props.type
		} );
		const closeLabel = translate( 'Back' );
		const closeButtonAction = page.back.bind( page, this.props.allPostsUrl );
		const closeButtonUrl = '';
		const closeButtonAriaLabel = translate( 'Go back' );

		return (
			<div className={ className }>
				{ isCustomPostType && (
					<QueryPostTypes siteId={ this.props.siteId } />
				) }
				{ this.props.showDrafts && (
					<Button
						compact borderless
						className="editor-sidebar__close"
						onClick={ this.props.toggleDrafts }
						aria-label={ translate( 'Close drafts list' ) }>
						<Gridicon icon="cross" />
						{ translate( 'Close' ) }
					</Button>
				) }
				{ ! this.props.showDrafts && (
					<Button
						compact borderless
						className="editor-sidebar__close"
						href={ closeButtonUrl }
						onClick={ closeButtonAction }
						aria-label={ closeButtonAriaLabel }>
						<Gridicon icon="arrow-left" size={ 18 } />
						{ closeLabel }
					</Button>
				) }
				{ this.props.typeSlug === 'post' && this.props.siteId && (
					<PostCountsData siteId={ this.props.siteId } status="draft">
						<DraftsButton onClick={ this.props.toggleDrafts } />
					</PostCountsData>
				) }
			</div>
		);
	}

} );

export default connect(
	( state ) => {
		const siteId = get( getSelectedSite( state ), 'ID' );
		const postId = getEditorPostId( state );
		const typeSlug = get( getEditedPost( state, siteId, postId ), 'type' );

		return {
			siteId,
			typeSlug,
			type: getPostType( state, siteId, typeSlug ),
			showDrafts: isEditorDraftsVisible( state )
		};
	},
	( dispatch ) => {
		return bindActionCreators( {
			toggleDrafts: toggleEditorDraftsVisible
		}, dispatch );
	}
)( EditorSidebarHeader );
