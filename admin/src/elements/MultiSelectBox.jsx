import { memo, useCallback } from 'react';

import Checkbox from '@mui/joy/Checkbox';
import ListItem from '@mui/joy/ListItem';
import List from '@mui/joy/List';
import Sheet from '@mui/joy/Sheet';

const MultiSelectBox = ( { selected, items, onChange, handleSelected, wrapItems = false } ) => {
	const defaultHandleSelected = useCallback( ( checked, optionKey ) => {
		if ( checked ) {
			onChange( [ ...selected, optionKey ] );
		} else {
			onChange( selected.filter( ( selectedKey ) => selectedKey !== optionKey ) );
		}
	}, [ onChange, selected ] );

	// accept object or array for options like [1, 2, 3, ....]
	const optionItems = Array.isArray( items )
		? items.reduce( ( obj, key ) => {
			obj[ key ] = key;
			return obj;
		}, {} )
		: Object.entries( items );

	return (
		<Sheet variant="outlined" sx={ { p: 1, borderRadius: 'sm' } }>
			<List
				orientation="horizontal"
				wrap={ wrapItems }
				sx={ {
					'--List-gap': '6px',
					'--ListItem-minHeight': 0,
					'--ListItem-paddingLeft': '8px',
					'--ListItem-paddingRight': '8px',
				} }
			>
				{ optionItems.map( ( [ key, value ] ) => (
					<ListItem key={ key }>
						<Checkbox
							size="sm"
							disableIcon
							overlay
							label={ value }
							checked={ selected.includes( key ) }
							color={ selected.includes( key ) ? 'primary' : 'neutral' }
							variant={ selected.includes( key ) ? 'outlined' : 'plain' }
							onChange={ ( event ) => {
								if ( handleSelected ) {
									handleSelected( event.target.checked, key );
									return false;
								}
								defaultHandleSelected( event.target.checked, key );
							} }
							slotProps={ {
								action: ( { checked } ) => ( {
									sx: { bgcolor: checked ? 'primary.softBg' : 'transparent' },
								} ),
							} }
						/>
					</ListItem>
				) ) }
			</List>
		</Sheet>
	);
};

export default memo( MultiSelectBox );
