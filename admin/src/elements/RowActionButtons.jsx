import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useTablePanels from '../hooks/useTablePanels';
import SvgIcon from './SvgIcon';

import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import Stack from '@mui/joy/Stack';

function RowActionButtons( { onEdit, editOtherTable, onDelete, children } ) {
	const { __ } = useI18n();
	const { activatePanel } = useTablePanels();

	return (
		<Stack className="action-buttons-wrapper" direction="row" alignItems="center" justifyContent="right" spacing={ 0.5 } >
			{ children }
			{ onEdit &&
				<Tooltip title={ __( 'Edit row' ) } arrow placement="bottom">
					<IconButton
						size="xs"
						onClick={ () => {
							onEdit();
							if ( ! editOtherTable ) {
								activatePanel( 'rowEditor' );
							}
						} }
					>
						<SvgIcon name="edit" />
					</IconButton>
				</Tooltip>
			}
			{ onDelete &&
				<Tooltip title={ __( 'Delete row' ) } arrow placement="bottom">
					<IconButton
						size="xs"
						variant="soft"
						color="danger"
						onClick={ () => onDelete() }
					>
						<SvgIcon name="trash" />
					</IconButton>
				</Tooltip>
			}

		</Stack>
	);
}

export default memo( RowActionButtons );
