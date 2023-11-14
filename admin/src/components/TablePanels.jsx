import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useTablePanels from '../hooks/useTablePanels';

import SvgIcon from '../elements/SvgIcon';

import AnswerGeneratorPanel from './generator/AnswerGeneratorPanel';
import EditRowPanel from './EditRowPanel';
import ExportPanel from './ExportPanel';
import ImportPanel from './ImportPanel';
import DeletePanel from './DeletePanel';
import DeleteFilteredPanel from './DeleteFilteredPanel';
import DetailsPanel from './DetailsPanel';
import ChangesPanel from './ChangesPanel/ChangesPanel';
import ContentGapMonitoringPanel from './ContentGapMonitoringPanel';

function TablePanels( { props } ) {
	const { __ } = useI18n();
	const activePanel = useTablePanels( ( state ) => state.activePanel );
	const { options } = props;

	return (
		<>
			{
				activePanel === 'deleteall' &&
				<DeletePanel title={ __( 'Delete All?' ) }
					text={ __( 'Are you sure you wish to delete all rows? This action will remove them from every module where this table is present.' ) }
					buttonText={ __( 'Delete All' ) }
					buttonIcon={ <SvgIcon name="trash" /> }
					action="delete-all"
				/>
			}

			{
				activePanel === 'deleteSelected' &&
				<DeletePanel title={ __( 'Delete Selected?' ) }
					text={ __( 'Are you sure you wish to delete selected rows? This action will remove them from every module where this table is present.' ) }
					buttonText={ __( 'Delete selected' ) }
					buttonIcon={ <SvgIcon name="trash" /> }
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
				! isNaN( activePanel ) &&
				<DetailsPanel { ...options } />
			}
			{
				activePanel === 'changesPanel' &&
				<ChangesPanel />
			}
			{
				activePanel === 'answerGeneratorPanel' &&
				<AnswerGeneratorPanel />
			}
			{
				activePanel === 'contentGapMonitoring' &&
				<ContentGapMonitoringPanel />
			}
		</>
	);
}

export default memo( TablePanels );
