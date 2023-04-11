import { useI18n } from '@wordpress/react-i18n';
import Tooltip from './Tooltip';

export default function TooltipSortingFiltering( { props } ) {
	const { __ } = useI18n();
	const { isFetching, sortingColumn, filters } = props;

	return (
		<>
			{ isFetching && ( sortingColumn || filters )
				? <Tooltip center>{ __( 'Filtering & Sorting…' ) }</Tooltip>
				: null
			}
		</>
	);
}
