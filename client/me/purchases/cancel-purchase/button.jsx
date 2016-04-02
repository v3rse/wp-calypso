/**
 * External Dependencies
 */
import page from 'page';
import React from 'react';

/**
 * Internal Dependencies
 */
import analytics from 'analytics';
import Button from 'components/button';
import { cancelPurchase } from 'lib/upgrades/actions';
import Dialog from 'components/dialog';
import { getName, getSubscriptionEndDate, isOneTimePurchase, isRefundable, isSubscription } from 'lib/purchases';
import { isDomainRegistration } from 'lib/products-values';
import notices from 'notices';
import paths from 'me/purchases/paths';
import { cancelAndRefundPurchase } from 'lib/upgrades/actions';

const CancelPurchaseButton = React.createClass( {
	propTypes: {
		purchase: React.PropTypes.object.isRequired,
		selectedSite: React.PropTypes.object.isRequired
	},

	getInitialState() {
		return { disabled: false };
	},

	handleCancelPurchaseClick() {
		if ( isDomainRegistration( this.props.purchase ) ) {
			return this.goToCancelConfirmation();
		}

		this.setState( { showDialog: true } );
	},

	closeDialog() {
		this.setState( { showDialog: false } );
	},

	renderCancelConfirmationDialog() {
		const { domain, priceText } = this.props.purchase,
			purchaseName = getName( this.props.purchase ),
			buttons = [
				{
					action: 'hide',
					label: this.translate( "No, I'll Keep It" ),
					onClick: this.closeDialog
				},
				{
					action: 'cancel',
					label: this.translate( 'Yes, Cancel Now' ),
					isPrimary: true,
					disabled: this.state.submitting,
					onClick: this.submitCancelPurchase
				},
			];

		return (
			<Dialog
				isVisible={ this.state.showDialog }
				buttons={ buttons }
				onClose={ this.closeDialog }
				className="cancel-purchase-button__warning-dialog">
				<h1>
					{ this.translate( 'Cancel %(purchaseName)s', {
						args: {
							purchaseName
						}
					} ) }
				</h1>
				<p>
					{ this.translate(
						'Are you sure you want to cancel and remove %(purchaseName)s from {{em}}%(domain)s{{/em}}? ' +
						'All plan features and custom changes will be removed from your site and you will be refunded %(priceText)s.', {
							args: {
								purchaseName,
								domain,
								priceText
							},
							components: {
								em: <em />
							}
						}
					) }
				</p>
			</Dialog>
		);
	},

	goToCancelConfirmation() {
		const { id } = this.props.purchase,
			{ slug } = this.props.selectedSite;

		page( paths.confirmCancelPurchase( slug, id ) );
	},

	cancelPurchase() {
		const { purchase } = this.props,
			{ id } = purchase;

		this.toggleDisabled();

		cancelPurchase( id, ( success ) => {
			const purchaseName = getName( purchase ),
				subscriptionEndDate = getSubscriptionEndDate( purchase );

			if ( success ) {
				notices.success( this.translate(
					'%(purchaseName)s was successfully cancelled. It will be available for use until it expires on %(subscriptionEndDate)s.',
					{
						args: {
							purchaseName,
							subscriptionEndDate
						}
					}
				), { persistent: true } );

				page( paths.list() );
			} else {
				notices.error( this.translate(
					'There was a problem canceling %(purchaseName)s. ' +
					'Please try again later or contact support.',
					{
						args: { purchaseName }
					}
				) );
				this.toggleDisabled();
			}
		} );
	},

	toggleDisabled() {
		this.setState( {
			disabled: ! this.state.disabled
		} );
	},

	handleSubmit( error, response ) {
		if ( error ) {
			notices.error( error.message );
			return;
		}

		notices.success( response.message, { persistent: true } );

		analytics.tracks.recordEvent(
			'calypso_purchases_cancel_form_submit',
			{ product_slug: this.props.purchase.productSlug }
		);

		page.redirect( paths.list() );
	},

	submitCancelPurchase() {
		this.setState( { submitting: true } );

		cancelAndRefundPurchase( this.props.purchase.id, null, this.handleSubmit );
	},

	render() {
		const { purchase } = this.props;

		let text, onClick;

		if ( isRefundable( purchase ) ) {
			onClick = this.handleCancelPurchaseClick;

			if ( isDomainRegistration( purchase ) ) {
				text = this.translate( 'Cancel Domain and Refund' );
			}

			if ( isSubscription( purchase ) ) {
				text = this.translate( 'Cancel Subscription and Refund' );
			}

			if ( isOneTimePurchase( purchase ) ) {
				text = this.translate( 'Cancel and Refund' );
			}
		} else {
			onClick = this.cancelPurchase;

			if ( isDomainRegistration( purchase ) ) {
				text = this.translate( 'Cancel Domain' );
			}

			if ( isSubscription( purchase ) ) {
				text = this.translate( 'Cancel Subscription' );
			}
		}

		return (
			<div>
				<Button
					className="cancel-purchase__button"
					disabled={ this.state.disabled }
					onClick={ onClick }
					primary>
					{ text }
				</Button>
				{ this.renderCancelConfirmationDialog() }
			</div>

		);
	}
} );

export default CancelPurchaseButton;
