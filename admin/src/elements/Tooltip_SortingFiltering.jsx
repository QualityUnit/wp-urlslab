import { useI18n } from '@wordpress/react-i18n';
import Loader from '../components/Loader';
import Tooltip from './Tooltip';

export default function TooltipSortingFiltering( { props } ) {
	const { __ } = useI18n();
	const { isFetching, sorting, filters } = props;

	return (
		isFetching && ( sorting?.length || filters?.length )
			? <Tooltip center>
				<Loader>
					{ __( 'Filtering & Sorting…' ) }<br />
					{ __( '(might take a while)' ) }
				</Loader>
			</Tooltip>
			: null
	);
}
