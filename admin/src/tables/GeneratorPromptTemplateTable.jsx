import { memo, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';

import {
	useInfiniteFetch,
	SortBy,
	SingleSelectMenu,
	InputField,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	DateTimeFormat, RowActionButtons, TableSelectCheckbox,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import useAIModelsQuery from '../queries/useAIModelsQuery';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';
import TextArea from '../elements/Textarea';
import DescriptionBox from '../elements/DescriptionBox';

const title = __( 'Add New Prompt Template', 'wp-urlslab' );
const paginationId = 'template_id';
const header = {
	template_name: __( 'Name', 'wp-urlslab' ),
	prompt_type: __( 'Prompt type', 'wp-urlslab' ),
	prompt_template: __( 'Prompt template', 'wp-urlslab' ),
	model_name: __( 'Model', 'wp-urlslab' ),
	updated: __( 'Updated', 'wp-urlslab' ),
};
const initialState = { columnVisibility: { prompt_template: false } };

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			title,
			paginationId,
			slug,
			header,
			id: 'template_id',
		} );
	}, [ setTable, slug ] );

	return init && <GeneratorPromptTemplateTable slug={ slug } />;
}

function GeneratorPromptTemplateTable( { slug } ) {
	const {
		columnHelper,
		data,
		isLoading,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const setTable = useTableStore( ( state ) => state.setTable );

	const { data: aiModels, isLoading: isLoadingAiModels } = useAIModelsQuery();
	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );
	const { deleteRow, updateRow } = useChangeRow();

	const columns = useMemo( () => ( ! columnTypes || ! aiModels ) ? [] : [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'template_name', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'prompt_type', {
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.prompt_type.values[ cell.getValue() ],
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
			cell: ( cell ) => aiModels[ cell.getValue() ],
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
	], [ aiModels, columnHelper, columnTypes, deleteRow, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading || isLoadingColumnTypes || isLoadingAiModels ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table', 'wp-urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table features a library of prompts that can be used to create AI-generated text content for various aspects within the plugin.', 'wp-urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom />

			<Table
				className="fadeInto"
				initialState={ initialState }
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>

			<TableEditorManager slug={ slug } />
		</>
	);
}

const TableEditorManager = memo( ( { slug } ) => {
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();

	const { columnTypes } = useColumnTypesQuery( slug );

	const rowEditorCells = useMemo( () => ( {
		template_name: <InputField defaultValue="" liveUpdate fullWidth label={ header.template_name }
			description={ __( 'Prompt name for simple identification', 'wp-urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, template_name: val } ) } required />,

		prompt_template: <TextArea liveUpdate allowResize fullWidth rows={ 5 }
			description={ ( __( 'Prompt template used to generate text', 'wp-urlslab' ) ) }
			defaultValue="" label={ header.prompt_template } onChange={ ( val ) => {
				setRowToEdit( { ...rowToEdit, prompt_template: val } );
			} } />,

		model_name: <SingleSelectMenu autoClose defaultAccept description={ __( 'AI model used for the prompt', 'wp-urlslab' ) } items={ aiModelsSuccess ? aiModels : {} } defaultValue={ aiModelsSuccess ? Object.keys( aiModels )[ 0 ] : '' } name="model" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, model_name: val } ) }>{ header.model_name }</SingleSelectMenu>,

		prompt_type: <SingleSelectMenu autoClose defaultAccept description={ __( 'Task type used for the prompt', 'wp-urlslab' ) } items={ columnTypes?.prompt_type.values } defaultValue="B" name="prompt_type" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, prompt_type: val } ) }>{ header.prompt_type }</SingleSelectMenu>,

	} ), [ aiModels, aiModelsSuccess, columnTypes?.prompt_type, rowToEdit, setRowToEdit ] );

	useEffect( () => {
		if ( aiModelsSuccess ) {
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
				}
			) );
		}
	}, [ aiModels, aiModelsSuccess, rowEditorCells ] );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				...useTablePanels.getState(),
				deleteCSVCols: [ paginationId ],
			}
		) );
	}, [] );
} );
