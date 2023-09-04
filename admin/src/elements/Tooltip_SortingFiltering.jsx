import { useI18n } from '@wordpress/react-i18n';
import { useIsFetching } from '@tanstack/react-query';
import useTableStore from '../hooks/useTableStore';
import filtersArray from '../lib/filtersArray';
import Loader from '../components/Loader';
import Tooltip from './Tooltip';

export default function TooltipSortingFiltering( ) {
	const { __ } = useI18n();
	const { sorting, filters } = useTableStore();
	const slug = useTableStore( ( state ) => state.slug );
	const fetchingStatus = useIsFetching( { queryKey: [ slug, filtersArray( filters ), sorting ? sorting : [] ] } );

	return (
		fetchingStatus && ( sorting?.length || ( filters && Object.keys( filters ).length ) )
			? <Tooltip center>
				<Loader isWhite>
					{ __( 'Filtering & Sorting…' ) }<br />
					{ __( '(might take a while)' ) }
				</Loader>
			</Tooltip>
			: null
	);
}
