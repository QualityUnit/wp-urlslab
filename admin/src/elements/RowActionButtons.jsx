import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useTablePanels from '../hooks/useTablePanels';
import { ReactComponent as Edit } from '../assets/images/icons/icon-edit.svg';
import { ReactComponent as Trash } from '../assets/images/icons/icon-trash.svg';

import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import Stack from '@mui/joy/Stack';

function RowActionButtons( { onEdit, onDelete, children } ) {
	const { __ } = useI18n();
	const { activatePanel } = useTablePanels();

	return (
		<Stack direction="row" alignItems="center" spacing={ 1 } >
			{ children }
			{ onEdit &&
				<Tooltip title={ __( 'Edit row' ) } >
					<IconButton
						size="xs"
						onClick={ () => {
							onEdit();
							activatePanel( 'rowEditor' );
						} }
					>
						<Edit />
					</IconButton>
				</Tooltip>

			}
			<Tooltip title={ __( 'Delete row' ) } >
				<IconButton
					size="xs"
					color="danger"
					onClick={ () => onDelete() }
				>
					<Trash />
				</IconButton>
			</Tooltip>

		</Stack>
	);
}

export default memo( RowActionButtons );
