import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import IconButton from './IconButton';
import { ReactComponent as SortIcon } from '../assets/images/icons/icon-sort.svg';
import { ReactComponent as SortASC } from '../assets/images/icons/icon-sort-asc.svg';
import { ReactComponent as SortDESC } from '../assets/images/icons/icon-sort-desc.svg';
import useTableStore from '../hooks/useTableStore';
import { useSorting } from '../hooks/filteringSorting';

const SortBy = ( ( props ) => {
	const { __ } = useI18n();
	const { id: key } = props?.header;
	const header = useTableStore( ( state ) => state.header );
	const sorting = useTableStore( ( state ) => state.sorting );
	const { sortBy } = useSorting();
	let sortedBy = sorting?.length && sorting?.filter( ( k ) => k?.key === key )[ 0 ];
	sortedBy = sortedBy ? sortedBy?.dir : undefined;

	const sortIcon = () => {
		switch ( sortedBy ) {
			case 'ASC':
				return <SortASC />;
			case 'DESC':
				return <SortDESC />;
			default:
				return <SortIcon />;
		}
	};

	return (
		<div className="flex flex-align-center">
			<IconButton
				onClick={ () => sortBy( key ) }
				className={ `${ sortedBy ? 'active' : '' }` }
				tooltip={ `${ __( 'Sort by' ) } ${ header[ key ] }` }
			>{ sortIcon() }
			</IconButton>
			{ header[ key ] }
		</div>
	);
} );

export default memo( SortBy );
