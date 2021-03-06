/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { getEditorPostId, isEditorNewPost, isEditorDraftsVisible, getEditorPath } from '../selectors';

describe( 'selectors', () => {
	describe( '#getEditorPostId()', () => {
		it( 'should return the current editor post ID', () => {
			const postId = getEditorPostId( {
				ui: {
					editor: {
						postId: 183
					}
				}
			} );

			expect( postId ).to.equal( 183 );
		} );
	} );

	describe( '#isEditorNewPost()', () => {
		it( 'should return false if a post ID is currently set', () => {
			const isNew = isEditorNewPost( {
				ui: {
					editor: {
						postId: 183
					}
				}
			} );

			expect( isNew ).to.be.false;
		} );

		it( 'should return true if no post ID is currently set', () => {
			const isNew = isEditorNewPost( {
				ui: {
					editor: {
						postId: null
					}
				}
			} );

			expect( isNew ).to.be.true;
		} );
	} );

	describe( '#isEditorDraftsVisible()', () => {
		it( 'should return the current drafts visible state', () => {
			const showDrafts = isEditorDraftsVisible( {
				ui: {
					editor: {
						showDrafts: true
					}
				}
			} );

			expect( showDrafts ).to.be.true;
		} );
	} );

	describe( '#getEditorPath()', () => {
		it( 'should return the post path with the post ID if post unknown', () => {
			const path = getEditorPath( {
				sites: {
					items: {
						2916284: {
							ID: 2916284,
							URL: 'https://example.wordpress.com'
						}
					}
				},
				posts: {
					items: {},
					edits: {}
				}
			}, 2916284, 841 );

			expect( path ).to.equal( '/post/example.wordpress.com/841' );
		} );

		it( 'should return the post path with the site ID if site unknown', () => {
			const path = getEditorPath( {
				sites: {
					items: {}
				},
				posts: {
					items: {},
					edits: {}
				}
			}, 2916284, 841 );

			expect( path ).to.equal( '/post/2916284/841' );
		} );

		it( 'should prefix the post route for post types', () => {
			const path = getEditorPath( {
				sites: {
					items: {
						2916284: {
							ID: 2916284,
							URL: 'https://example.wordpress.com'
						}
					}
				},
				posts: {
					items: {
						'3d097cb7c5473c169bba0eb8e3c6cb64': { ID: 841, site_ID: 2916284, global_ID: '3d097cb7c5473c169bba0eb8e3c6cb64', type: 'post' }
					},
					edits: {}
				}
			}, 2916284, 841 );

			expect( path ).to.equal( '/post/example.wordpress.com/841' );
		} );

		it( 'should prefix the page route for page types', () => {
			const path = getEditorPath( {
				sites: {
					items: {
						2916284: {
							ID: 2916284,
							URL: 'https://example.wordpress.com'
						}
					}
				},
				posts: {
					items: {
						'6c831c187ffef321eb43a67761a525a3': { ID: 413, site_ID: 2916284, global_ID: '6c831c187ffef321eb43a67761a525a3', type: 'page' }
					},
					edits: {}
				}
			}, 2916284, 413 );

			expect( path ).to.equal( '/page/example.wordpress.com/413' );
		} );

		it( 'should prefix the type route for custom post types', () => {
			const path = getEditorPath( {
				sites: {
					items: {
						2916284: {
							ID: 2916284,
							URL: 'https://example.wordpress.com'
						}
					}
				},
				posts: {
					items: {
						'0fcb4eb16f493c19b627438fdc18d57c': { ID: 120, site_ID: 2916284, global_ID: 'f0cb4eb16f493c19b627438fdc18d57c', type: 'jetpack-portfolio' }
					},
					edits: {}
				}
			}, 2916284, 120 );

			expect( path ).to.equal( '/edit/jetpack-portfolio/example.wordpress.com/120' );
		} );

		it( 'should derive post type from edited post', () => {
			const path = getEditorPath( {
				sites: {
					items: {
						2916284: {
							ID: 2916284,
							URL: 'https://example.wordpress.com'
						}
					}
				},
				posts: {
					items: {},
					edits: {
						2916284: {
							'': {
								type: 'jetpack-portfolio'
							}
						}
					}
				}
			}, 2916284 );

			expect( path ).to.equal( '/edit/jetpack-portfolio/example.wordpress.com' );
		} );
	} );
} );
