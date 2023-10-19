import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useTablePanels from '../hooks/useTablePanels';

import SvgIcon from './SvgIcon';

import Button from '@mui/joy/Button';
import useSelectRows from '../hooks/useSelectRows';

function DeleteSelectedButton() {
	const { __ } = useI18n();
	const selectedRows = useSelectRows( ( state ) => state.selectedRows || {} );
	const activePanel = useTablePanels( ( state ) => state.activePanel );
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	console.log( Object.values( selectedRows ) );

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
