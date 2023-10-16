import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import useTablePanels from '../../hooks/useTablePanels';
import { CloseIcon } from '../../lib/tableImports';

import ContentGenerator from './ContentGenerator';

function AnswerGeneratorPanel() {
	const { __ } = useI18n();
	const { activatePanel, setRowToEdit, rowToEdit } = useTablePanels();

	return (
		<div className="urlslab-panel-wrap urlslab-panel-modal ultrawide fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ __( 'Answer Generator' ) }</h3>
					<button className="urlslab-panel-close" onClick={ () => activatePanel( 'rowInserter' ) }>
						<CloseIcon />
					</button>
				</div>
				<div className="urlslab-panel-content mt-l">
					<ContentGenerator
						noPromptTemplate
						useEditor={ false }
						initialData={ {
							keywordsList: [ { q: rowToEdit.question, checked: true } ],
							//dataSource: 'SERP_CONTEXT',
							initialPromptType: 'A',
							mode: 'QUESTION_ANSWERING',
						} }
						onGenerateComplete={ ( val ) => {
							setRowToEdit( { ...rowToEdit, answer: val } );
							activatePanel( 'rowInserter' );
						} }
					/>
				</div>
			</div>
		</div>
	);
}

export default memo( AnswerGeneratorPanel );
