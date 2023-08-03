import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useTablePanels from '../hooks/useTablePanels';
import IconButton from '../elements/IconButton';
import { ReactComponent as Edit } from '../assets/images/icons/icon-edit.svg';
import { ReactComponent as Trash } from '../assets/images/icons/icon-trash.svg';

function RowActionButtons( { onEdit, onDelete, children } ) {
	const { __ } = useI18n();
	const { activatePanel } = useTablePanels();

	return (
		<div className="flex editRow-buttons">
			{ children }
			{ onEdit &&
			<IconButton
				onClick={ () => {
					onEdit();
					activatePanel( 'rowEditor' );
				} }
				tooltipClass="align-left"
				tooltip={ __( 'Edit row' ) }
			>
				<Edit />
			</IconButton>
			}
			<IconButton
				className="ml-s"
				onClick={ () => onDelete() }
				tooltipClass="align-left"
				tooltip={ __( 'Delete row' ) }
			>
				<Trash />
			</IconButton>
		</div>
	);
}

export default memo( RowActionButtons );
