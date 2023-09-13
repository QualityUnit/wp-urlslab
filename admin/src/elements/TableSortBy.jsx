import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { ReactComponent as SortIcon } from '../assets/images/icons/icon-sort.svg';
import { ReactComponent as SortASC } from '../assets/images/icons/icon-sort-asc.svg';
import { ReactComponent as SortDESC } from '../assets/images/icons/icon-sort-desc.svg';
import useTableStore from '../hooks/useTableStore';
import { useSorting } from '../hooks/filteringSorting';

import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

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
		<Stack direction="row" alignItems="center" spacing={ 0.5 } >
			<Tooltip title={ `${ __( 'Sort by' ) } ${ header[ key ] }` } >
				<IconButton
					size="xs"
					color={ sortedBy ? 'primary' : 'neutral' }
					variant={ sortedBy ? 'soft' : 'plain' }
					onClick={ () => sortBy( key ) }
				>
					{ sortIcon() }
				</IconButton>
			</Tooltip>
			<Typography className="column-label" component="span" color={ sortedBy ? 'primary' : null }>{ header[ key ] }</Typography>
		</Stack>
	);
} );

export default memo( SortBy );
