import { memo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n/';
import { postFetch } from '../api/fetching';

import { ReactComponent as Loader } from '../assets/images/icons/icon-loading-input.svg';

const Credits = ( () => {
	const { __ } = useI18n();
	const queryClient = useQueryClient();

	const { data, isFetching } = useQuery( {
		queryKey: [ 'credits' ],
		queryFn: async () => {
			const result = await postFetch( `billing/credits`, { rows_per_page: 50 } );
			return result.json();
		},
		refetchOnWindowFocus: false,
		retry: 1,
		refetchInterval: 60 * 60 * 1000, // refresh every hour
	} );

	return (
		data?.credits &&
		<small className="fadeInto flex flex-align-center mr-m">
			{ __( 'Remaining credits: ' ) }
			<strong className="ml-s">
				<button className={ `urlslab-header-credits no-margin no-padding` } onClick={ () => queryClient.invalidateQueries( [ 'credits' ] ) }>
					{ isFetching &&
					<Loader className="mr-xs" />
					}
					{ data?.credits }
				</button>
			</strong>
		</small>
	);
} );

export default memo( Credits );
