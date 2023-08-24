import { useI18n } from '@wordpress/react-i18n';

import useTablePanels from '../hooks/useTablePanels';

import QueryDetailPanel from './detailsPanel/QueryDetailPanel';
import EditRowPanel from './EditRowPanel';
import ExportPanel from './ExportPanel';
import ImportPanel from './ImportPanel';
import DeletePanel from './DeletePanel';
import DeleteFilteredPanel from './DeleteFilteredPanel';
import DetailsPanel from './DetailsPanel';
import { ReactComponent as Trash } from '../assets/images/icons/icon-trash.svg';
import ChangesPanel from './ChangesPanel/ChangesPanel';

export default function TablePanels( { props } ) {
	const { options } = props;
	const { activePanel } = useTablePanels();
	const { __ } = useI18n();
	return (
		<>
			{
				activePanel === 'deleteall' &&
				<DeletePanel title={ __( 'Delete All?' ) }
					text={ __( 'Are you sure you wish to delete all rows? This action will remove them from every module where this table is present.' ) }
					button={ __( 'Delete All' ) }
					buttonIcon={ <Trash /> }
					action="delete-all"
				/>
			}

			{
				activePanel === 'deleteSelected' &&
				<DeletePanel title={ __( 'Delete Selected?' ) }
					text={ __( 'Are you sure you wish to delete selected rows? This action will remove them from every module where this table is present.' ) }
					button={ __( 'Delete selected' ) }
					buttonIcon={ <Trash /> }
					action="delete-selected"
				/>
			}
			{
				activePanel === 'deleteAllFiltered' &&
				<DeleteFilteredPanel />
			}
			{
				activePanel === 'export' &&
				<ExportPanel { ...options } />
			}
			{
				activePanel === 'import' &&
				<ImportPanel />
			}
			{
				activePanel === 'rowInserter' &&
				<EditRowPanel { ...options } />
			}

			{
				activePanel === 'rowEditor' &&
				<EditRowPanel editorMode { ...options } />
			}
			{
				typeof activePanel === 'number' &&
				<DetailsPanel { ...options } />
			}
			{
				activePanel === 'changesPanel' &&
				<ChangesPanel />
			}
			{
				activePanel === 'queryDetailPanel' &&
				<QueryDetailPanel />
			}
		</>
	);
}
