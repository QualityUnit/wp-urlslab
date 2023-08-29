/*
*	Prefix generated css classes with app ID
* 	- increase css specificity to avoid overriding from wp base styles
*/

import { prefixer } from 'stylis';
import createCache from '@emotion/cache';

export const cache = createCache( {
	key: 'urlslab-css',
	stylisPlugins: [
		( element ) => {
			if ( element.type === 'rule' ) {
				element.props.forEach( ( node, index, array ) => {
					if ( array[ index ].startsWith( '.urlslab-css' ) ) {
						array[ index ] = `[id=urlslab-root] ${ node }`;
					}
				} );
			}
		},
		prefixer,
	],
} );
