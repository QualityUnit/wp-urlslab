import { memo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import filtersArray from '../lib/filtersArray';
import useTableStore from '../hooks/useTableStore';
import { ReactComponent as RefreshIcon } from '../assets/images/icons/icon-refresh.svg';
import IconButton from '../elements/IconButton';

function RefreshTableButton( { noCount } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const sorting = useTableStore( ( state ) => state.sorting );
	const filters = useTableStore( ( state ) => state.filters );
	const slug = useTableStore( ( state ) => state.slug );
	const fetchingStatus = useTableStore( ( state ) => state.fetchingStatus );

	const handleRefresh = () => {
		queryClient.invalidateQueries( [ slug, filtersArray( filters ), sorting ? sorting : [] ] );

		if ( ! noCount ) {
			queryClient.invalidateQueries( [ slug, 'count', filtersArray( filters ) ] );
		}
	};

	return <IconButton
		className={ `ml-m refresh-icon ${ fetchingStatus ? 'refreshing' : '' }` }
		tooltip={ __( 'Refresh table' ) }
		tooltipClass="align-left-0"
		onClick={ handleRefresh }
	>
		<RefreshIcon />
	</IconButton>;
}

export default memo( RefreshTableButton );
