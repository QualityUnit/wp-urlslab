import { useI18n } from '@wordpress/react-i18n';
import { useIsFetching } from '@tanstack/react-query';
import useTableStore from '../hooks/useTableStore';
import { filtersArray } from '../hooks/filteringSorting';
import Loader from '../components/Loader';
import Tooltip from './Tooltip';

export default function TooltipSortingFiltering( { customSlug } ) {
	const { __ } = useI18n();
	let slug = useTableStore( ( state ) => state.activeTable );
	if ( customSlug ) {
		slug = customSlug;
	}
	const filters = useTableStore( ( state ) => state.tables[ slug ]?.filters || {} );
	const sorting = useTableStore( ( state ) => state.tables[ slug ]?.sorting || [] );
	const fetchOptions = useTableStore( ( state ) => state.tables[ slug ]?.fetchOptions || {} );

	const fetchingStatus = useIsFetching( { queryKey: [ slug, filtersArray( filters ), sorting, fetchOptions ] } );

	return (
		fetchingStatus && ( sorting?.length || ( filters && Object.keys( filters ).length ) || ( fetchOptions && Object.keys( fetchOptions ) ) )
			? <Tooltip center>
				<Loader isWhite>
					{ __( 'Refreshing table…' ) }<br />
					{ __( '(might take a while)' ) }
				</Loader>
			</Tooltip>
			: null
	);
}
