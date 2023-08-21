import { useI18n } from '@wordpress/react-i18n';
import useTableStore from '../hooks/useTableStore';
import Loader from '../components/Loader';
import Tooltip from './Tooltip';

export default function TooltipSortingFiltering( ) {
	const { __ } = useI18n();
	const { fetchingStatus, sorting, filters } = useTableStore();

	return (
		fetchingStatus && ( sorting?.length || ( filters && Object.keys( filters ).length ) )
			? <Tooltip center>
				<Loader>
					{ __( 'Filtering & Sorting…' ) }<br />
					{ __( '(might take a while)' ) }
				</Loader>
			</Tooltip>
			: null
	);
}
