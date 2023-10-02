import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';

import SvgIcon from './SvgIcon';

import Button from '@mui/joy/Button';

function DeleteSelectedButton() {
	const { __ } = useI18n();
	const selectedRows = useTableStore( ( state ) => state.selectedRows );
	const activePanel = useTablePanels( ( state ) => state.activePanel );
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );

	if ( selectedRows && Object.keys( selectedRows ).length > 0 && ! activePanel?.includes( 'changesPanel' ) ) {
		return <Button
			color="danger"
			onClick={ () => activatePanel( 'deleteSelected' ) }
			startDecorator={ <SvgIcon name="trash" /> }
			sx={ { mr: 1 } }
		>{ __( 'Delete selected' ) }</Button>;
	}
}

export default memo( DeleteSelectedButton );
