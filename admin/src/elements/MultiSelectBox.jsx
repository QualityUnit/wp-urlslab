import { memo, useCallback, useMemo } from 'react';
import { __ } from '@wordpress/i18n';

import { checkItemReturnType, sortArrayByArray } from '../lib/helpers';

import Checkbox from '@mui/joy/Checkbox';
import ListItem from '@mui/joy/ListItem';
import List from '@mui/joy/List';
import Sheet from '@mui/joy/Sheet';
import { Box, Button } from '@mui/joy';

/*
 * items:
 * 	object { key1: value1, key2: value2, ... }
 * 	array [ key1, key2, ... ] // useful for number selection
 *
 * fitWidth: fit width of input to 100% of parent
 * fitItems: fit items width to width of wrapper
 */

const MultiSelectBox = ( { selected, items, onChange, handleSelected, wrapItems, fitItems, fitWidth, selectAll } ) => {
	const optionItems = useMemo( () => (
		Array.isArray( items )
		// convert array to object with the same key and value
			? items.reduce( ( obj, key ) => {
				obj[ key ] = key;
				return obj;
			}, {} )
			: items
	), [ items ] );

	const selectedAll = selected.length === Object.keys( optionItems ).length;

	const defaultHandleSelected = useCallback( ( checked, optionKey ) => {
		if ( checked ) {
			// check type of item key to return the same
			onChange( sortArrayByArray( [ ...selected, optionKey ], Object.keys( optionItems ) ) );
		} else {
			onChange( sortArrayByArray( selected.filter( ( selectedKey ) => selectedKey !== optionKey ), Object.keys( optionItems ) ) );
		}
	}, [ onChange, optionItems, selected ] );

	const handleSelectAll = useCallback( () => {
		onChange( selectedAll ? [] : Object.keys( optionItems ).map( ( item ) => checkItemReturnType( item, optionItems ) ) );
	}, [ onChange, optionItems, selectedAll ] );

	return (
		<Sheet variant="outlined" sx={ {
			borderRadius: 'sm',
			boxShadow: 'xs',
			...( ! wrapItems && ! fitWidth ? { width: 'max-content' } : null ),
			...( fitWidth ? { width: '100%' } : null ),
		} }>
			<List
				orientation="horizontal"
				wrap={ wrapItems }
				sx={ ( theme ) => ( {
					...( wrapItems
						? {
							mr: 0.625,
							mb: 0.625,
							ml: `calc(${ theme.spacing( 0.625 ) } - var(--List-gap))`,
							mt: `calc(${ theme.spacing( 0.625 ) } - var(--List-gap))`,
						}
						: { m: 0.625 } ),
					'--List-gap': '6px',
					'--List-padding': 0,
					'--ListItem-minHeight': 0,
					'--ListItem-paddingLeft': '8px',
					'--ListItem-paddingRight': '8px',
					'--ListItem-radius': '4px',
				} ) }
			>
				{ Object.entries( optionItems ).map( ( [ key, value ] ) => {
					// make sure the type of key is correct, in some cases it can be number if items keys are numbers
					const typedKey = checkItemReturnType( key, optionItems );
					return <ListItem
						key={ typedKey }
						{ ...( fitItems ? { sx: { flexGrow: 1, justifyContent: 'center' } } : null ) }
					>
						<Checkbox
							size="sm"
							disableIcon
							overlay
							label={ value }
							checked={ selected.includes( typedKey ) }
							color={ selected.includes( typedKey ) ? 'primary' : 'neutral' }
							variant={ selected.includes( typedKey ) ? 'outlined' : 'plain' }
							onChange={ ( event ) => {
								if ( handleSelected ) {
									handleSelected( event.target.checked, typedKey );
									return false;
								}
								defaultHandleSelected( event.target.checked, typedKey );
							} }
							slotProps={ {
								action: ( { checked } ) => ( {
									sx: { bgcolor: checked ? 'primary.softBg' : 'transparent' },
								} ),
							} }
						/>
					</ListItem>;
				}
				) }
			</List>
			{ selectAll &&
			<Box sx={ ( theme ) => ( {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'end',
				width: '100%',
				bgcolor: `rgba(${ theme.vars.palette.primary.lightChannel } / 0.5)`,
			} ) }>
				<Button
					size="xxs"
					variant="text"
					onClick={ handleSelectAll }
					sx={ { textTransform: 'uppercase' } }
				>
					{ selectedAll
						? __( 'Deselect all' )
						: __( 'Select all' )
					}
				</Button>
			</Box>
			}
		</Sheet>
	);
};

export default memo( MultiSelectBox );
