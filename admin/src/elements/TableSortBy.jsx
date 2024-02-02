import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useTableStore from '../hooks/useTableStore';
import { useSorting } from '../hooks/useFilteringSorting';

import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import SvgIcon from './SvgIcon';

const SortBy = ( ( props ) => {
	const { __ } = useI18n();
	const { defaultSorting, tooltip } = props;
	const { id: key } = props?.header;
	let activeTable = useTableStore( ( state ) => state.activeTable );

	if ( props.customSlug ) {
		activeTable = props.customSlug;
	}
	const header = useTableStore( ( state ) => state.tables[ activeTable ]?.header );
	let sorting = useTableStore( ( state ) => state.tables[ activeTable ]?.sorting );
	if ( defaultSorting && sorting.length === 0 ) {
		sorting = defaultSorting;
	}

	const { sortBy } = useSorting( activeTable );
	let sortedBy = sorting?.length && sorting?.filter( ( k ) => k?.key === key )[ 0 ];
	sortedBy = sortedBy ? sortedBy?.dir : undefined;

	const sortIcon = () => {
		switch ( sortedBy ) {
			case 'ASC':
				return <SvgIcon name="sort-asc" />;
			case 'DESC':
				return <SvgIcon name="sort-desc" />;
			default:
				return <SvgIcon name="sort" />;
		}
	};

	if ( ! header ) {
		return null;
	}

	return (
		<Stack direction="row" alignItems="center" >
			{ header[ key ] && <Tooltip title={ `${ __( 'Sort by' ) } ${ header[ key ] }` } >
				<IconButton
					size="xs"
					color={ sortedBy ? 'primary' : 'neutral' }
					variant={ sortedBy ? 'soft' : 'plain' }
					onClick={ () => sortBy( key ) }
				>
					{ sortIcon() }
				</IconButton>
			</Tooltip> }
			<Tooltip title={ tooltip } >
				<Typography className="column-label" component="span" color={ sortedBy ? 'primary' : null } sx={ { pl: 0.5 } }>
					{ header[ key ] || props.customHeader }
				</Typography>
			</Tooltip>
		</Stack>
	);
} );

export default memo( SortBy );
