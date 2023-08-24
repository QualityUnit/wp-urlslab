import Button from './Button';
import { ReactComponent as PlusIcon } from '../assets/images/icons/icon-plus.svg';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';

export default function AddNewTableRecord( ) {
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const title = useTableStore( ( state ) => state.title );

	return title && <Button className="active" onClick={ () => activatePanel( 'rowInserter' ) }><PlusIcon />{ title }</Button>;
}
