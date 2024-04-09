import { memo, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router-dom';

import {
	useInfiniteFetch,
	Tooltip,
	SortBy,
	TextArea,
	InputField,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	DateTimeFormat,
	SingleSelectMenu,
	Editor,
	SvgIcon,
	IconButton,
	RowActionButtons,
	Button,
	Stack,
	TableSelectCheckbox,
} from '../lib/tableImports';

import { useFilter } from '../hooks/useFilteringSorting';
import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import useAIModelsQuery from '../queries/useAIModelsQuery';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';
import copyToClipBoard from '../lib/copyToClipBoard';
import DescriptionBox from '../elements/DescriptionBox';

const title = __( 'Add New Shortcode', 'wp-urlslab' );
const paginationId = 'shortcode_id';
const supported_variables_description = __( 'Supported variables: {{page_title}}, {{page_url}}, {{domain}}, {{language_code}}, {{language}}. If the `videoid` attribute is enabled, the following variables can be used: {{video_captions}}, {{video_captions_text}}, {{video_title}}, {{video_description}}, {{video_published_at}}, {{video_duration}}, {{video_channel_title}}, {{video_tags}}. Custom attributes can also be incorporated via shortcode in the form {{your_custom_attribute_name}}', 'wp-urlslab' );
const header = {
	shortcode_id: __( 'ID', 'wp-urlslab' ),
	shortcode_name: __( 'Name', 'wp-urlslab' ),
	shortcode_type: __( 'Type', 'wp-urlslab' ),
	prompt: __( 'Prompt', 'wp-urlslab' ),
	semantic_context: __( 'Semantic context', 'wp-urlslab' ),
	url_filter: __( 'URL filter', 'wp-urlslab' ),
	default_value: __( 'Default value', 'wp-urlslab' ),
	template: __( 'HTML template', 'wp-urlslab' ),
	model: __( 'Model', 'wp-urlslab' ),
	status: __( 'Status', 'wp-urlslab' ),
	date_changed: __( 'Last change', 'wp-urlslab' ),
	usage_count: __( 'Usage', 'wp-urlslab' ),
	shortcode: __( 'Shortcode', 'wp-urlslab' ),
};
const initialState = { columnVisibility: { semantic_context: false, url_filter: false, default_value: false, template: false, model: false } };

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
		} );
	}, [ setTable, slug ] );

	return init && <GeneratorShortcodeTable slug={ slug } />;
}

function GeneratorShortcodeTable( { slug } ) {
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

	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );
	const { deleteRow, updateRow } = useChangeRow();
	const { dispatchSetFilters, createFilterKey } = useFilter( 'generator/result' );

	const ActionButton = useMemo( () => ( { cell, onClick } ) => {
		const { status: statusType } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( statusType !== 'A' ) &&
					<Tooltip title={ __( 'Activate', 'wp-urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" color="success" onClick={ () => onClick( 'A' ) }>
							<SvgIcon name="activate" />
						</IconButton>
					</Tooltip>
				}
				{
					( statusType !== 'D' ) &&
					<Tooltip title={ __( 'Disable', 'wp-urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" color="danger" onClick={ () => onClick( 'D' ) }>
							<SvgIcon name="disable" />
						</IconButton>
					</Tooltip>
				}
			</div>
		);
	}, [] );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'shortcode_id', {
			header: ( th ) => <SortBy { ...th } />,
			size: 45,
		} ),
		columnHelper.accessor( 'shortcode_name', {
			header: ( th ) => <SortBy { ...th } />,
			tooltip: ( cell ) => cell.getValue(),
			size: 100,
		} ),
		columnHelper.accessor( 'shortcode_type', {
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.shortcode_type.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper.accessor( 'prompt', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'semantic_context', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'url_filter', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'default_value', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'template', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 300,
		} ),
		columnHelper.accessor( 'model', {
			tooltip: ( cell ) => columnTypes?.model.values[ cell.getValue() ],
			cell: ( cell ) => columnTypes?.model.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 120,
		} ),
		columnHelper.accessor( 'status', {
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.status.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'date_changed', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper.accessor( 'usage_count', {
			header: header.usage_count,
			size: 60,
		} ),
		columnHelper.accessor( 'shortcode', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<Tooltip
						title={
						// translators: %s is automatically generated text, do not change it.
							__( 'Click to copy %s to the clipboard', 'wp-urlslab' ).replace( '%s', cell.getValue() )
						}
						disablePortal
					>
						<IconButton
							size="xs"
							onClick={ () => copyToClipBoard( cell.getValue() ) }
						>
							<SvgIcon name="copy" />
						</IconButton>
					</Tooltip>
					<span className="ellipsis">{ cell.getValue() }</span>
				</Stack>
			),
			header: header.shortcode,
			size: 250,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell } ) }
				onDelete={ () => deleteRow( { cell } ) }
			>
				<Button
					component={ Link }
					to="/Generator/result"
					size="xxs"
					onClick={ () => {
						dispatchSetFilters( { [ createFilterKey( 'shortcode_id' ) ]: { op: '=', val: cell.row.original.shortcode_id, keyType: 'number' } } );
					} }
					sx={ { mr: 1 } }
				>
					{ __( 'Show results', 'wp-urlslab' ) }
				</Button>
				<Tooltip title={ __( 'Copy shortcode to the clipboard', 'wp-urlslab' ) } arrow placement="bottom">
					<IconButton size="xs" onClick={ () => copyToClipBoard( cell.row.original.shortcode ) } >
						<SvgIcon name="copy" />
					</IconButton>
				</Tooltip>
				<ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'status', newVal: val, cell } ) } />
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ columnHelper, columnTypes, createFilterKey, deleteRow, dispatchSetFilters, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading || isLoadingColumnTypes ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table', 'wp-urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The AI Generator shortcode defines the text generation process within a specific shortcode location. These shortcodes can be incorporated within a WordPress template or added as a single code to the page editor. As soon as the shortcode appears on the page and text is generated, it's replaced by the actual text. When the shortcode is displayed for the first time, it's replaced with empty text and a new generator task is dispatched to a queue. This process can take several days until all texts are created. In the Settings tab, there is an option to have all new text pending for approval or approved right away. To view entries with this status, simply use the filter. Approve each entry individually for them to appear on your website. If not approved, these texts won't be publicly visible on your site.", 'wp-urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom noImport />

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
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();

	const { columnTypes } = useColumnTypesQuery( slug );

	const rowEditorCells = useMemo( () => ( {
		shortcode_name: <InputField liveUpdate defaultValue="" description={ __( 'Shortcode name for simple identification', 'wp-urlslab' ) } label={ header.shortcode_name } onChange={ ( val ) => setRowToEdit( { shortcode_name: val } ) } required />,

		shortcode_type: <SingleSelectMenu autoClose defaultAccept description={ __( 'For video context types, the semantic search query should include a YouTube video ID or YouTube video URL', 'wp-urlslab' ) }
			items={ columnTypes?.shortcode_type.values } name="shortcode_type" defaultValue="S" onChange={ ( val ) => setRowToEdit( { shortcode_type: val } ) }>{ header.shortcode_type }</SingleSelectMenu>,

		prompt: <TextArea rows="5" fullWidth description={ ( supported_variables_description ) }
			liveUpdate defaultValue="" label={ header.prompt } onChange={ ( val ) => setRowToEdit( { prompt: val } ) } required />,

		semantic_context: <InputField liveUpdate description={ ( supported_variables_description + ' ' + __( 'For video context types, the semantic context must include the YouTube video ID: {{videoid}}', 'wp-urlslab' ) ) }
			defaultValue="" label={ header.semantic_context } onChange={ ( val ) => setRowToEdit( { semantic_context: val } ) } hidden={ rowToEdit?.shortcode_type === 'V' } />,

		url_filter: <InputField liveUpdate defaultValue="" description={ __( 'Suggested variables: {{page_url}} for generating data from the current URL. {{domain}} for generating data from any semantically relevant page on your domain. Use a fixed URL for generating data from a specific URL. {{custom_url_attribute_name}} if a custom attribute is forwarded to the shortcode in the HTML template', 'wp-urlslab' ) } label={ header.url_filter } onChange={ ( val ) => setRowToEdit( { url_filter: val } ) } hidden={ rowToEdit?.shortcode_type === 'V' } />,

		default_value: <InputField liveUpdate description={ __( 'Enter the text to be shown in the shortcode prior to URLsLab generating text from your prompt. If no text is desired, leave blank', 'wp-urlslab' ) } defaultValue="" label={ header.default_value } onChange={ ( val ) => setRowToEdit( { default_value: val } ) } />,

		template: <Editor fullWidth height={ 300 } description={ ( supported_variables_description + __( ' The generated text value can be retrieved in the template via the {{value}} variable. If the generator produced a JSON, you can access it using {{json_value.attribute_name}}', 'wp-urlslab' ) ) } defaultValue="" label={ header.template } onChange={ ( val ) => {
			setRowToEdit( { template: val } );
		} } required />,

		model: <SingleSelectMenu defaultAccept autoClose items={ aiModelsSuccess ? aiModels : {} } name="model" defaultValue="gpt-3.5-turbo-1106" onChange={ ( val ) => setRowToEdit( { model: val } ) }>{ header.model }</SingleSelectMenu>,

	} ), [ aiModels, aiModelsSuccess, columnTypes?.shortcode_type, rowToEdit?.shortcode_type, setRowToEdit ] );

	useEffect( () => {
		if ( aiModelsSuccess ) {
			useTablePanels.setState( () => (
				{
					...useTablePanels.getState(),
					rowEditorCells: {
						...rowEditorCells,
						model: {
							...rowEditorCells.model,
							props: {
								...rowEditorCells.model.props,
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

