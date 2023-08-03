import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useTablePanels from '../hooks/useTablePanels';
import { Edit, Trash, IconButton } from '../lib/tableImports';

function RowActionButtons( { editable, onUpdate, onDelete, children } ) {
	const { __ } = useI18n();
	const { activatePanel } = useTablePanels();

	return (
		<div className="flex editRow-buttons">
			{ children }
			{ editable &&
			<IconButton
				onClick={ () => {
					onUpdate();
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
