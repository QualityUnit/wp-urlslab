import Button from '@mui/joy/Button';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';

import SvgIcon from './SvgIcon';

export default function AddNewTableRecord( ) {
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const activeTable = useTableStore( ( state ) => state.activeTable );
	const title = useTableStore( ( state ) => state.tables[ activeTable ]?.title );

	return title && <Button
		onClick={ () => activatePanel( 'rowInserter' ) }
		startDecorator={ <SvgIcon name="plus" /> }
		sx={ { mr: 1 } }
	>
		{ title }
	</Button>;
}
