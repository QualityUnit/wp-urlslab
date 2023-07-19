import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n/';

import useCreditsQuery from '../queries/useCreditsQuery';
import { ReactComponent as Loader } from '../assets/images/icons/icon-loading-input.svg';

const Credits = ( () => {
	const { __ } = useI18n();
	const { data, isFetching, refetch: refetchCredits } = useCreditsQuery();

	return (
		data?.credits &&
		<small className="fadeInto flex flex-align-center mr-m">
			{ __( 'Remaining credits: ' ) }
			<strong className="ml-s">
				<button className={ `urlslab-header-credits no-margin no-padding` } onClick={ refetchCredits }>
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
