
import { __ } from '@wordpress/i18n';
import { InputField, SingleSelectMenu } from '../../lib/tableImports';
import TextArea from '../../elements/Textarea';
import useAIModelsQuery from '../../queries/useAIModelsQuery';
import useTablePanels from '../../hooks/useTablePanels';
import useAIGenerator from '../../hooks/useAIGenerator';

export const promptTypes = {
	G: __( 'General' ),
	S: __( 'Summarization' ),
	B: __( 'Blog generation' ),
	A: __( 'Question answering' ),
};

export default function usePromptTemplateEditorRow() {
	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();
	const { setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const { aiGeneratorConfig } = useAIGenerator();

	const rowEditorCells = {
		template_name: <div>
			<InputField liveUpdate defaultValue={ rowToEdit.template_name } label={ __( 'Template Name' ) }
				description={ __( 'Up to 255 characters.' ) }
				onChange={ ( val ) => setRowToEdit( { ...rowToEdit, template_name: val } ) } required />
		</div>,

		prompt_template: <TextArea liveUpdate allowResize rows={ 10 }
			description={ ( __( 'Prompt Template to use for Generating Text' ) ) }
			defaultValue={ aiGeneratorConfig.promptTemplate } label={ __( 'Prompt Template' ) }
			onChange={ ( val ) => {
				setRowToEdit( { ...rowToEdit, prompt_template: val } );
			} } />,

		model_name: <SingleSelectMenu autoClose defaultAccept description={ __( 'AI Model to use with the template' ) }
			items={ aiModelsSuccess ? aiModels : {} } defaultValue={ aiGeneratorConfig.modelName }
			name="model" onChange={ ( val ) => setRowToEdit( {
				...rowToEdit,
				model_name: val,
			} ) }>{ __( 'Model' ) }</SingleSelectMenu>,

		prompt_type: <SingleSelectMenu autoClose defaultAccept
			description={ __( 'The Type of task that the prompt can be used in' ) }
			items={ promptTypes }
			defaultValue="G"
			name="prompt_type"
			onChange={ ( val ) => setRowToEdit( {
				...rowToEdit,
				prompt_type: val,
			} )
			}>{ __( 'Prompt Type ' ) }</SingleSelectMenu>,
	};

	return { rowEditorCells, rowToEdit };
}
