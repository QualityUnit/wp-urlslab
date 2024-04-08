
import { __ } from '@wordpress/i18n';
import { InputField, SingleSelectMenu } from '../../lib/tableImports';
import TextArea from '../../elements/Textarea';
import useAIModelsQuery from '../../queries/useAIModelsQuery';
import useTablePanels from '../../hooks/useTablePanels';
import useAIGenerator, { promptTypes } from '../../hooks/useAIGenerator';

export default function usePromptTemplateEditorRow() {
	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();
	const { setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const { aiGeneratorConfig } = useAIGenerator();

	const rowEditorCells = {
		template_name: <div>
			<InputField liveUpdate defaultValue={ rowToEdit.template_name } label={ __( 'Template Name', 'wp-urlslab' ) }
				description={ __( 'Up to 255 characters.', 'wp-urlslab' ) }
				onChange={ ( val ) => setRowToEdit( { ...rowToEdit, template_name: val } ) } required />
		</div>,

		prompt_template: <TextArea liveUpdate allowResize rows={ 10 }
			description={ ( __( 'Prompt Template to use for Generating Text', 'wp-urlslab' ) ) }
			defaultValue={ aiGeneratorConfig.promptTemplate } label={ __( 'Prompt Template', 'wp-urlslab' ) }
			onChange={ ( val ) => {
				setRowToEdit( { ...rowToEdit, prompt_template: val } );
			} } />,

		model_name: <SingleSelectMenu autoClose defaultAccept description={ __( 'AI Model to use with the template', 'wp-urlslab' ) }
			items={ aiModelsSuccess ? aiModels : {} } defaultValue={ aiGeneratorConfig.modelName }
			name="model" onChange={ ( val ) => setRowToEdit( {
				...rowToEdit,
				model_name: val,
			} ) }>{ __( 'Model', 'wp-urlslab' ) }</SingleSelectMenu>,

		prompt_type: <SingleSelectMenu autoClose defaultAccept
			description={ __( 'The Type of task that the prompt can be used in', 'wp-urlslab' ) }
			items={ promptTypes }
			defaultValue="G"
			name="prompt_type"
			onChange={ ( val ) => setRowToEdit( {
				...rowToEdit,
				prompt_type: val,
			} )
			}>{ __( 'Prompt Type ', 'wp-urlslab' ) }</SingleSelectMenu>,
	};

	return { rowEditorCells, rowToEdit };
}
