import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useTablePanels from '../hooks/useTablePanels';

import SvgIcon from './SvgIcon';

import Button from '@mui/joy/Button';
import useSelectRows from '../hooks/useSelectRows';
import useTableStore from '../hooks/useTableStore';

function DeleteSelectedButton() {
	const { __ } = useI18n();
	const slug = useTableStore( ( state ) => state.activeTable );
	const selectedRows = useSelectRows( ( state ) => state.selectedRows[ slug ] || {} );
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );

	if ( selectedRows && Object.keys( selectedRows ).length > 0 ) {
		return <Button
			color="danger"
			onClick={ () => activatePanel( 'deleteSelected' ) }
			startDecorator={ <SvgIcon name="trash" /> }
			sx={ { mr: 1 } }
		>{ __( 'Delete selected' ) }</Button>;
	}
}

export default memo( DeleteSelectedButton );
