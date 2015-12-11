// These could be rewritten as `export * from`, pending resolution of Babel
// transform bug: http://phabricator.babeljs.io/T6888

import * as cart from './cart';
import * as checkout from './checkout';
import * as domainManagement from './domain-management';
import * as domainSearch from './domain-search';
import * as purchases from './purchases';

export default {
	...cart,
	...checkout,
	...domainManagement,
	...domainSearch,
	...purchases
};
