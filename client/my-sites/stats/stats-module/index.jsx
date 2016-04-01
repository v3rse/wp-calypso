/**
 * External dependencies
 */
import React from 'react';
import page from 'page';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import toggle from '../mixin-toggle';
import skeleton from '../mixin-skeleton';
import observe from 'lib/mixins/data-observe';
import ErrorPanel from '../stats-error';
import InfoPanel from '../info-panel';
import StatsList from '../stats-list';
import StatsListLegend from '../stats-list/legend';
import DownloadCsv from '../stats-download-csv';
import DatePicker from '../stats-date-picker';
import Card from 'components/card';
import StatsModulePlaceholder from './placeholder';
import Gridicon from 'components/gridicon';
import UpgradeNudge from 'my-sites/upgrade-nudge';

export default React.createClass( {
	displayName: 'StatModule',

	mixins: [ toggle(), skeleton( 'data' ), observe( 'dataList' ) ],

	data: function() {
		return this.props.dataList.response.data;
	},

	getInitialState: function() {
		return { noData: this.props.dataList.isEmpty() };
	},

	componentWillReceiveProps: function( nextProps ) {
		this.setState( { noData: nextProps.dataList.isEmpty() } );
	},

	hasSummaryPage: function() {
		var noSummaryPages = [ 'tags-categories', 'publicize' ];
		return -1 === noSummaryPages.indexOf( this.props.path );
	},

	viewAllHandler: function( event ) {
		var summaryPageLink = '/stats/' + this.props.period.period + '/' + this.props.path + '/' + this.props.site.slug + '?startDate=' + this.props.date;

		event.preventDefault();

		if ( this.props.beforeNavigate ) {
			this.props.beforeNavigate();
		}
		page( summaryPageLink );
	},

	render: function() {
		var data = this.data(),
			noData = this.props.dataList.isEmpty(),
			hasError = this.props.dataList.isError(),
			headerLink = this.props.moduleStrings.title,
			infoIcon = this.state.showInfo ? 'info' : 'info-outline',
			isLoading = this.props.dataList.isLoading(),
			moduleHeaderTitle,
			statsList,
			viewSummary,
			moduleToggle,
			classes;

		classes = classNames(
			'stats-module',
			{
				'is-expanded': this.state.showModule,
				'is-loading': isLoading,
				'is-showing-info': this.state.showInfo,
				'has-no-data': noData,
				'is-showing-error': hasError || noData
			}
		);

		statsList = <StatsList moduleName={ this.props.path } data={ data } followList={ this.props.followList } />;

		if ( this.hasSummaryPage() ) {
			headerLink = ( <a href="#" onClick={ this.viewAllHandler }>{ this.props.moduleStrings.title }</a> );
		}

		if ( !this.props.summary ) {
			moduleHeaderTitle = (
				<h4 className="module-header-title">{ headerLink }</h4>
			);
			moduleToggle = (
				<li className="module-header-action toggle-services"><a href="#" className="module-header-action-link" aria-label={ this.translate( 'Expand or collapse panel', { context: 'Stats panel action' } ) } title={ this.translate( 'Expand or collapse panel', { context: 'Stats panel action' } ) } onClick={ this.toggleModule }><Gridicon icon="chevron-down" /></a></li>
			);

			if ( this.props.dataList.response.viewAll ) {
				viewSummary = (
					<div key="view-all" className="module-expand">
						<a href="#" onClick={ this.viewAllHandler }>{ this.translate( 'View All', { context: 'Stats: Button label to expand a panel' } ) }<span className="right"></span></a>
					</div>
				);
			}
		} else {
			moduleHeaderTitle = <DatePicker period={ this.props.period.period } date={ this.props.period.startOf } summary={ true } />;
		}

		const footerInfo = [];
		if ( this.props.summary && this.props.path === 'searchterms' ) {
			footerInfo.push(
				<div className="module-content-text nudge" key="nudge">
					<UpgradeNudge
						title="Google Analytics is included in our Premium Plan"
						message="Upgrade to Premium for Google Analytics integration, custom domain and other power features"
						icon="stats"
						event="googleAnalytics-stats-searchterms"
					/>
				</div>
			);
			footerInfo.push( <DownloadCsv key="csv" period={ this.props.period } path={ this.props.path } site={ this.props.site } dataList={ this.props.dataList } /> );
		}

		return (
			<Card className={ classes }>
				<div className={ this.props.className }>
					<div className="module-header">
						{ moduleHeaderTitle }
						<ul className="module-header-actions">
							<li className="module-header-action toggle-info"><a href="#" className="module-header-action-link" aria-label={ this.translate( 'Show or hide panel information', { context: 'Stats panel action' } ) } title={ this.translate( 'Show or hide panel information', { context: 'Stats panel action' } ) } onClick={ this.toggleInfo } ><Gridicon icon={ infoIcon } /></a></li>
							{ moduleToggle }
						</ul>
					</div>
					<div className="module-content">
						<InfoPanel module={ this.props.path } />
						{ ( noData && ! hasError ) ? <ErrorPanel className="is-empty-message" message={ this.props.moduleStrings.empty } /> : null }
						{ hasError ? <ErrorPanel className={ 'network-error' } /> : null }
						<StatsListLegend value={ this.props.moduleStrings.value } label={ this.props.moduleStrings.item } />
						<StatsModulePlaceholder isLoading={ isLoading } />
						{ statsList }
						{ footerInfo }
					</div>
					{ viewSummary }
				</div>
			</Card>
		);
	}
} );
