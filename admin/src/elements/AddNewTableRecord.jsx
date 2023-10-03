import Button from '@mui/joy/Button';
import { ReactComponent as PlusIcon } from '../assets/images/icons/icon-plus.svg';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';

export default function AddNewTableRecord( ) {
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const activeTable = useTableStore( ( state ) => state.activeTable );
	const title = useTableStore( ( state ) => state.tables[ activeTable ]?.title );

	return title && <Button
		onClick={ () => activatePanel( 'rowInserter' ) }
		startDecorator={ <PlusIcon /> }
		sx={ { mr: 1 } }
	>
		{ title }
	</Button>;
}
