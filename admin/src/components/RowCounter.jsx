import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n/';

import filtersArray from '../lib/filtersArray';
import { postFetch } from '../api/fetching';

const Counter = ( ( { filters, slug } ) => {
	const { __ } = useI18n();
	const { data: rowCount } = useQuery( {
		queryKey: [ slug, `count`, filtersArray( filters ) ],
		queryFn: async () => {
			const count = await postFetch( `${ slug }/count`, { filters: filtersArray( filters ) } );
			return count.json();
		},
		refetchOnWindowFocus: false,
	} );
	return (
		rowCount &&
		<small className="urlslab-rowcount fadeInto flex flex-align-center">
			{ __( 'Rows: ' ) }
			<strong className="ml-s">{ rowCount }</strong>
		</small>
	);
} );

export default memo( Counter );
