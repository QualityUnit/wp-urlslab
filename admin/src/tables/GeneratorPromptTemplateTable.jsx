import { memo, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n';

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
import DescriptionBox from '../elements/DescriptionBox';

const title = __( 'Add New Prompt Template' );
const paginationId = 'template_id';

const templateTypes = {
	B: __( 'Blog generation' ),
	A: __( 'Question answering' ),
};

const header = {
	template_name: __( 'Name' ),
	prompt_type: __( 'Prompt type' ),
	prompt_template: __( 'Prompt template' ),
	model_name: __( 'Model' ),
	updated: __( 'Updated' ),
};

export default function GeneratorPromptTemplateTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow();

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						title,
						paginationId,
						slug,
						header,
						id: 'template_id',
					},
				},
			}
		) );
	}, [ slug ] );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						data,
					},
				},
			}
		) );
	}, [ data, slug ] );

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
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
			size: 120,
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
			size: 120,
		} ),
		columnHelper.accessor( 'updated', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: () => header.updated,
			size: 120,
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
	], [ aiModels, aiModelsSuccess, columnHelper, deleteRow, isSelected, selectRows, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table features a library of prompts that can be used to create AI-generated text content for various aspects within the plugin.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { prompt_template: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referer={ ref }
			>
				<TooltipSortingFiltering />
				<>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</>
			</Table>
			<TableEditorManager />
		</>
	);
}

const TableEditorManager = memo( () => {
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();

	const rowEditorCells = useMemo( () => ( {
		template_name: <InputField defaultValue="" liveUpdate label={ header.template_name }
			description={ __( 'Prompt name for simple identification' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, template_name: val } ) } required />,

		prompt_template: <TextArea liveUpdate allowResize rows={ 15 }
			description={ ( __( 'Prompt template used to generate text' ) ) }
			defaultValue="" label={ header.prompt_template } onChange={ ( val ) => {
				setRowToEdit( { ...rowToEdit, prompt_template: val } );
			} } />,

		model_name: <SingleSelectMenu autoClose defaultAccept description={ __( 'AI model used for the prompt' ) } items={ aiModelsSuccess ? aiModels : {} } defaultValue={ aiModelsSuccess ? Object.keys( aiModels )[ 0 ] : '' } name="model" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, model_name: val } ) }>{ header.model_name }</SingleSelectMenu>,

		prompt_type: <SingleSelectMenu autoClose defaultAccept description={ __( 'Task type used for the prompt' ) } items={ templateTypes } defaultValue="B" name="prompt_type" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, prompt_type: val } ) }>{ header.prompt_type }</SingleSelectMenu>,

	} ), [ aiModels, aiModelsSuccess, rowToEdit, setRowToEdit ] );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				...useTablePanels.getState(),
				rowEditorCells: {
					...rowEditorCells,
					model_name: {
						...rowEditorCells.model_name,
						props: {
							...rowEditorCells.model_name.props,
							items: aiModels,
						},
					},
				},
				deleteCSVCols: [ 'url_id' ],
			}
		) );
	}, [ aiModels, rowEditorCells ] );
} );
