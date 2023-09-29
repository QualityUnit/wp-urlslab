import { memo } from 'react';
import { useQueryClient, useIsFetching } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import filtersArray from '../lib/filtersArray';
import useTableStore from '../hooks/useTableStore';
import SvgIcon from './SvgIcon';
import IconButton from '../elements/IconButton';

function RefreshTableButton( { noCount } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const sorting = useTableStore( ( state ) => state.sorting );
	const filters = useTableStore( ( state ) => state.filters );
	const slug = useTableStore( ( state ) => state.slug );
	const fetchingStatus = useIsFetching( { queryKey: ! noCount ? [ slug, 'count', filtersArray( filters ) ] : [ slug, filtersArray( filters ), sorting ? sorting : [] ] } );

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
		<SvgIcon name="refresh" />
	</IconButton>;
}

export default memo( RefreshTableButton );
