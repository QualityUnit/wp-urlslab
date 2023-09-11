import { useRef, useState } from 'react';

import { useI18n } from '@wordpress/react-i18n';

import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';

import { ReactComponent as IconTrash } from '../assets/images/icons/icon-trash.svg';

export default function EditableList( { inputPlaceholder, inputButtonText, items, addItemCallback, removeItemCallback } ) {
	const { __ } = useI18n();
	const [ newItem, setNewItem ] = useState( '' );
	const inputRef = useRef( null );

	const handleAddNewItem = () => {
		if ( newItem !== '' ) {
			addItemCallback( newItem.trim() );
			setNewItem( '' );
			inputRef?.current?.querySelector( '.MuiInput-input' )?.focus();
		}
	};

	return (
		<>
			<Input
				value={ newItem }
				variant="soft"
				placeholder={ inputPlaceholder }
				onChange={ ( event ) => setNewItem( event.target.value ) }
				endDecorator={
					<Button
						size="sm"
						onClick={ handleAddNewItem }
					>
						{ inputButtonText ? inputButtonText : __( 'Add' ) }
					</Button>
				}
				ref={ inputRef } // MUI Joy component doesn't support direct 'inputRef' prop like default MUI
				sx={ { marginY: ( theme ) => theme.spacing( 1 ) } }
			/>
			{ items.length > 0 &&
				<List>
					{ items.map( ( item ) =>
						<ListItem key={ item }>
							<Stack
								direction="row"
								justifyContent="space-between"
								alignItems="center"
								spacing={ 1 }
								sx={ { width: '100%' } }
							>
								<Typography level="body-sm">{ item }</Typography>
								<IconButton
									size="sm"
									color="danger"
									onClick={ () => removeItemCallback( item ) }
								>
									<IconTrash />
								</IconButton>
							</Stack>
						</ListItem>

					)
					}
				</List>
			}
		</>
	);
}
