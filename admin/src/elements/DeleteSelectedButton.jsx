import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import Button from './Button';
import { ReactComponent as Trash } from '../assets/images/icons/icon-trash.svg';

function DeleteSelectedButton() {
	const { __ } = useI18n();
	const selectedRows = useTableStore( ( state ) => state.selectedRows );
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );

	if ( selectedRows.length > 0 ) {
		return <Button danger className="mr-s" onClick={ () => activatePanel( 'deleteSelected' ) }><Trash />{ __( 'Delete selected' ) }</Button>;
	}
}

export default memo( DeleteSelectedButton );
