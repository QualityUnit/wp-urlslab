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

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useAIModelsQuery from '../queries/useAIModelsQuery';
import TextArea from '../elements/Textarea';
// import { active } from 'd3';

export default function GeneratorPromptTemplateTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add New Prompt Template' );
	const paginationId = 'template_id';

	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();

	const url = { filters, sorting };

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, filters, sorting, paginationId } );

	const { selectRows, deleteRow, deleteMultipleRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const { setRowToEdit } = useTablePanels();
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
		model_name: __( 'Model' ),
		prompt_type: __( 'Prompt type' ),
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
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.template_name }</SortBy>,
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
			<ModuleViewHeaderBottom
				table={ table }
				onDeleteSelected={ deleteMultipleRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				options={ { header, data, slug, url, paginationId,
					title,
					rowEditorCells,
					rowToEdit,
					id: 'template_id',
				} }
			/>
			<Table className="fadeInto"
				title={ title }
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
