import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n/';

import { filtersArray } from '../hooks/useFilteringSorting';
import { postFetch } from '../api/fetching';
import useTableStore from '../hooks/useTableStore';

const Counter = ( ( { customSlug, className } ) => {
	const { __ } = useI18n();
	let slug = useTableStore( ( state ) => state.activeTable );

	if ( customSlug ) {
		slug = customSlug;
	}

	const filters = useTableStore().useFilters( slug );
	const fetchOptions = useTableStore().useFetchOptions( slug );
	const allowCountFetchAbort = useTableStore( ( state ) => state.tables[ slug ]?.allowCountFetchAbort );

	const { data: rowCount } = useQuery( {
		queryKey: [ slug, `count`, filtersArray( filters ), fetchOptions ],
		queryFn: async ( { signal } ) => {
			if ( slug ) {
				const count = await postFetch(
					`${ slug }/count`,
					{ ...fetchOptions, filters: filtersArray( filters ) },
					{ ...( allowCountFetchAbort ? { signal } : null ) }
				);

				if ( count.ok ) {
					return count.json();
				}

				return 0;
			}
			return 0;
		},
		refetchOnWindowFocus: false,
	} );
	return (
		rowCount > 0 &&
		<small className={ `urlslab-rowcount fadeInto flex flex-align-center ${ className || '' }` }>
			{ __( 'Rows: ' ) }
			<strong className="ml-s">{ rowCount }</strong>
		</small>
	);
} );

export default memo( Counter );
