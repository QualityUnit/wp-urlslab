import Button from './Button';
import { ReactComponent as PlusIcon } from '../assets/images/icons/icon-plus.svg';
import useTablePanels from '../hooks/useTablePanels';

export default function AddNewTableRecord( { title } ) {
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	return <Button className="active" onClick={ () => activatePanel( 'rowInserter' ) }><PlusIcon />{ title }</Button>;
}
