import { useI18n } from '@wordpress/react-i18n';

import useTablePanels from '../hooks/useTablePanels';

import EditRowPanel from './EditRowPanel';
import ExportPanel from './ExportPanel';
import ImportPanel from './ImportPanel';
import DangerPanel from './DangerPanel';
import DetailsPanel from './DetailsPanel';
import { ReactComponent as Trash } from '../assets/images/icons/icon-trash.svg';

export default function TablePanels( { props } ) {
	const { options, initialRow, handlePanel } = props;
	const { activePanel } = useTablePanels();
	const { __ } = useI18n();
	return (
		<>
			{
				activePanel === 'deleteall' &&
				<DangerPanel title={ __( 'Delete All?' ) }
					text={ __( 'Are you sure you want to delete all rows? Deleting rows will remove them from all modules where this table occurs.' ) }
					button={ <><Trash />{ __( 'Delete All' ) }</> }
					handlePanel={ handlePanel }
					action="delete-all"
				/>
			}

			{
				activePanel === 'deleteSelected' &&
				<DangerPanel title={ __( 'Delete Selected?' ) }
					text={ __( 'Are you sure you want to delete selected rows? Deleting rows will remove them from all modules where this table occurs.' ) }
					button={ <><Trash />{ __( 'Delete selected' ) }</> }
					handlePanel={ handlePanel }
					action="delete-selected"
				/>
			}
			{
				activePanel === 'export' &&
				<ExportPanel { ...options }
					handlePanel={ handlePanel }
				/>
			}
			{
				activePanel === 'import' &&
				<ImportPanel options={ { ...options, initialRow } } handlePanel={ handlePanel } />
			}
			{
				activePanel === 'rowInserter' &&
					<EditRowPanel { ...options } handlePanel={ handlePanel } />
			}

			{
				activePanel === 'rowEditor' &&
				<EditRowPanel editorMode { ...options } handlePanel={ handlePanel } />
			}
			{
				typeof activePanel === 'number' &&
				<DetailsPanel optionsId={ activePanel } />
			}
		</>
	);
}
