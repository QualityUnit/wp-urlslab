import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n/';

import filtersArray from '../lib/filtersArray';
import { postFetch } from '../api/fetching';
import useTableStore from '../hooks/useTableStore';

const Counter = ( ( ) => {
	const { __ } = useI18n();
	const filters = useTableStore( ( state ) => state.filters );
	const slug = useTableStore( ( state ) => state.slug );
	const { data: rowCount } = useQuery( {
		queryKey: [ slug, `count`, filtersArray( filters ) ],
		queryFn: async () => {
			if ( slug ) {
				const count = await postFetch( `${ slug }/count`, { filters: filtersArray( filters ) } );
				return count.json();
			}
			return 0;
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
