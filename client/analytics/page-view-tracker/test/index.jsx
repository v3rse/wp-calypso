import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import noop from 'lodash/noop';

import useFakeDom from 'test/helpers/use-fake-dom';
import { useFakeTimers } from 'test/helpers/use-sinon';

import PageViewTracker from 'analytics/page-view-tracker/component';

describe( 'PageViewTracker', () => {
	let clock;

	useFakeDom();
	useFakeTimers( fakeClock => {
		clock = fakeClock
	} );

	it( 'should immediately fire off event when given no delay', done => {
		const state = { value: false };
		const recorder = () => {
			state.value = true;
		};

		mount(
			<PageViewTracker path="/test" title="test" { ...{ recorder } }>
				<div>Test</div>
			</PageViewTracker>
		);

		expect( state.value ).to.be.true;

		done();
	} );

	it( 'should wait for the delay before firing off the event', done => {
		const state = { value: false };
		const recorder = () => {
			state.value = true;
		};

		mount(
			<PageViewTracker delay={ 500 } path="/test" title="test" { ...{ recorder } }>
				<div>Test</div>
			</PageViewTracker>
		);

		expect( state.value ).to.be.false;

		clock.tick( 250 );

		expect( state.value ).to.be.false;

		clock.tick( 250 );

		expect( state.value ).to.be.true;

		done();
	} );

	it( 'should pass the appropriate event information', done => {
		const recorder = ( path, title ) => {
			expect( path ).to.equal( '/test' );
			expect( title ).to.equal( 'test' );

			done();
		};

		mount(
			<PageViewTracker path="/test" title="test" { ...{ recorder } }>
				<div>test</div>
			</PageViewTracker>
		);

		clock.tick( 10 );
	} );

	it( 'should pass down the children', () => {
		const wrapper = shallow(
			<PageViewTracker path="/test" title="test" recorder={ noop }>
				<div>test</div>
			</PageViewTracker>
		);

		expect( wrapper.equals( <div>test</div> ) ).to.be.true;
	} );
} );
