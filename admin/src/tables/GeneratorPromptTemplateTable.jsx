import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	SingleSelectMenu,
	InputField,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	DateTimeFormat, RowActionButtons,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import useAIModelsQuery from '../queries/useAIModelsQuery';
import TextArea from '../elements/Textarea';
// import { active } from 'd3';

export default function GeneratorPromptTemplateTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add New Prompt Template' );
	const paginationId = 'template_id';

	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { selectRows, deleteRow, updateRow } = useChangeRow();

	const { resetTableStore } = useTableStore();
	const { setRowToEdit, resetPanelsStore } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const templateTypes = {
		G: __( 'General' ),
		S: __( 'Summarization' ),
		B: __( 'Blog generation' ),
		A: __( 'Question answering' ),
	};

	const header = {
		template_name: __( 'Name' ),
		prompt_template: __( 'Prompt template' ),
		prompt_type: __( 'Prompt type' ),
		model_name: __( 'Model' ),
		updated: __( 'Updated' ),
	};

	const rowEditorCells = {
		template_name: <div>
			<InputField liveUpdate defaultValue={ rowToEdit.template_name } label={ header.template_name }
				description={ __( 'Prompt name for simple identification' ) }
				onChange={ ( val ) => setRowToEdit( { ...rowToEdit, template_name: val } ) } required />
		</div>,

		prompt_template: <TextArea liveUpdate allowResize rows={ 15 }
			description={ ( __( 'Prompt template used to generate text' ) ) }
			defaultValue="" label={ header.prompt_template } onChange={ ( val ) => {
				setRowToEdit( { ...rowToEdit, prompt_template: val } );
			} } />,

		model_name: <SingleSelectMenu autoClose defaultAccept description={ __( 'AI model used for the prompt' ) } items={ aiModelsSuccess ? aiModels : {} } defaultValue={ aiModelsSuccess ? Object.keys( aiModels )[ 0 ] : '' } name="model" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, model_name: val } ) }>{ header.model_name }</SingleSelectMenu>,

		prompt_type: <SingleSelectMenu autoClose defaultAccept description={ __( 'Task type used for the prompt' ) } items={ templateTypes } defaultValue="G" name="prompt_type" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, prompt_type: val } ) }>{ header.prompt_type }</SingleSelectMenu>,
	};

	useEffect( () => {
		resetTableStore();
		resetPanelsStore();
		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ 'url_id' ],
			}
		) );
		useTableStore.setState( () => (
			{
				title,
				paginationId,
				slug,
				header,
				id: 'template_id',
			}
		) );
	}, [] );

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
			}
		) );
	}, [ data ] );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				cell.row.toggleSelected();
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
				selectRows( val ? head : undefined );
			} } />,
		} ),
		columnHelper.accessor( 'template_name', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'prompt_type', {
			className: 'nolimit',
			cell: ( cell ) => templateTypes[ cell.getValue() ],
			header: () => header.prompt_type,
			size: 80,
		} ),
		columnHelper.accessor( 'prompt_template', {
			cell: ( cell ) => cell.getValue(),
			header: () => header.prompt_template,
			size: 200,
		} ),
		columnHelper.accessor( 'model_name', {
			className: 'nolimit',
			cell: ( cell ) => aiModelsSuccess && aiModels[ cell.getValue() ],
			header: () => header.model_name,
			size: 80,
		} ),
		columnHelper.accessor( 'updated', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: () => header.updated,
			size: 80,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell, id: 'template_id' } ) }
				onDelete={ () => deleteRow( { cell, id: 'template_id' } ) }
			>
			</RowActionButtons>,
			header: () => null,
			size: 0,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { prompt_template: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				<TooltipSortingFiltering />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
