import { memo, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import {
	useInfiniteFetch,
	Tooltip,
	Checkbox,
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
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import useAIModelsQuery from '../queries/useAIModelsQuery';
import copyToClipBoard from '../lib/copyToClipBoard';
import DescriptionBox from '../elements/DescriptionBox';

const title = __( 'Add New Shortcode' );
const paginationId = 'shortcode_id';
const supported_variables_description = __( 'Supported variables: {{page_title}}, {{page_url}}, {{domain}}, {{language_code}}, {{language}}. If the `videoid` attribute is enabled, the following variables can be used: {{video_captions}}, {{video_captions_text}}, {{video_title}}, {{video_description}}, {{video_published_at}}, {{video_duration}}, {{video_channel_title}}, {{video_tags}}. Custom attributes can also be incorporated via shortcode in the form {{your_custom_attribute_name}}' );

const statusTypes = {
	A: __( 'Active' ),
	D: __( 'Disabled' ),
};
const modelTypes = {
	'gpt-3.5-turbo-1106': __( 'OpenAI GPT 3.5 Turbo 16K' ),
	'gpt-4-1106-preview': __( 'OpenAI GPT 4 Turbo 128K' ),
};
const shortcodeTypeTypes = {
	S: __( 'Semantic search' ),
	V: __( 'Video context' ),
};

const header = {
	shortcode_id: __( 'ID' ),
	shortcode_name: __( 'Name' ),
	shortcode_type: __( 'Type' ),
	prompt: __( 'Prompt' ),
	semantic_context: __( 'Semantic context' ),
	url_filter: __( 'URL filter' ),
	default_value: __( 'Default value' ),
	template: __( 'HTML template' ),
	model: __( 'Model' ),
	status: __( 'Status' ),
	date_changed: __( 'Last change' ),
	usage_count: __( 'Usage' ),
	shortcode: __( 'Shortcode' ),
};

export default function GeneratorShortcodeTable( { slug } ) {
	const queryClient = useQueryClient();

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow();

	const ActionButton = useMemo( () => ( { cell, onClick } ) => {
		const { status: statusType } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( statusType !== 'A' ) &&
					<Tooltip title={ __( 'Activate' ) }>
						<IconButton size="xs" color="success" onClick={ () => onClick( 'A' ) }>
							<SvgIcon name="activate" />
						</IconButton>
					</Tooltip>
				}
				{
					( statusType !== 'D' ) &&
					<Tooltip title={ __( 'Disable' ) }>
						<IconButton size="xs" color="danger" onClick={ () => onClick( 'D' ) }>
							<SvgIcon name="disable" />
						</IconButton>
					</Tooltip>
				}
			</div>
		);
	}, [] );

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
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
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
			filterValMenu: shortcodeTypeTypes,
			className: 'nolimit',
			cell: ( cell ) => shortcodeTypeTypes[ cell.getValue() ],
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
			size: 200,
		} ),
		columnHelper.accessor( 'model', {
			tooltip: ( cell ) => modelTypes[ cell.getValue() ],
			cell: ( cell ) => modelTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'status', {
			filterValMenu: statusTypes,
			className: 'nolimit',
			cell: ( cell ) => statusTypes[ cell.getValue() ],
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
					<Tooltip title={
						// translators: %s is automatically generated text, do not change it.
						__( 'Click to copy %s to the clipboard' ).replace( '%s', cell.getValue() )
					}>
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
						queryClient.setQueryData( [ 'generator/result', 'filters' ], { filters: { shortcode_id: { op: '=', val: `${ cell.row.original.shortcode_id }`, keyType: 'number' } } } );
					} }
					sx={ { mr: 1 } }
				>
					{ __( 'Show results' ) }
				</Button>
				<Tooltip title={ __( 'Copy shortcode to the clipboard' ) }>
					<IconButton size="xs" onClick={ () => copyToClipBoard( cell.row.original.shortcode ) } >
						<SvgIcon name="copy" />
					</IconButton>
				</Tooltip>
				<ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'status', newVal: val, cell } ) } />
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ columnHelper, deleteRow, queryClient, selectRows, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The AI Generator shortcode defines the text generation process within a specific shortcode location. These shortcodes can be incorporated within a WordPress template or added as a single code to the page editor. As soon as the shortcode appears on the page and text is generated, it's replaced by the actual text. When the shortcode is displayed for the first time, it's replaced with empty text and a new generator task is dispatched to a queue. This process can take several days until all texts are created. In the Settings tab, there is an option to have all new text pending for approval or approved right away. To view entries with this status, simply use the filter. Approve each entry individually for them to appear on your website. If not approved, these texts won't be publicly visible on your site." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noImport
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { semantic_context: false, url_filter: false, default_value: false, template: false, model: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
			<TableEditorManager />
		</>
	);
}

const TableEditorManager = memo( () => {
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();

	const rowEditorCells = useMemo( () => ( {
		shortcode_name: <InputField liveUpdate defaultValue="" description={ __( 'Shortcode name for simple identification' ) } label={ header.shortcode_name } onChange={ ( val ) => setRowToEdit( { shortcode_name: val } ) } required />,

		shortcode_type: <SingleSelectMenu autoClose defaultAccept description={ __( 'For video context types, the semantic search query should include a YouTube video ID or YouTube video URL' ) }
			items={ shortcodeTypeTypes } name="shortcode_type" defaultValue="S" onChange={ ( val ) => setRowToEdit( { shortcode_type: val } ) }>{ header.shortcode_type }</SingleSelectMenu>,

		prompt: <TextArea rows="5" description={ ( supported_variables_description ) }
			liveUpdate defaultValue="" label={ header.prompt } onChange={ ( val ) => setRowToEdit( { prompt: val } ) } required />,

		semantic_context: <InputField liveUpdate description={ ( supported_variables_description + ' ' + __( 'For video context types, the semantic context must include the YouTube video ID: {{videoid}}' ) ) }
			defaultValue="" label={ header.semantic_context } onChange={ ( val ) => setRowToEdit( { semantic_context: val } ) } hidden={ rowToEdit?.shortcode_type === 'V' } />,

		url_filter: <InputField liveUpdate defaultValue="" description={ __( 'Suggested variables: {{page_url}} for generating data from the current URL. {{domain}} for generating data from any semantically relevant page on your domain. Use a fixed URL for generating data from a specific URL. {{custom_url_attribute_name}} if a custom attribute is forwarded to the shortcode in the HTML template' ) } label={ header.url_filter } onChange={ ( val ) => setRowToEdit( { url_filter: val } ) } hidden={ rowToEdit?.shortcode_type === 'V' } />,

		default_value: <InputField liveUpdate description={ __( 'Enter the text to be shown in the shortcode prior to URLsLab generating text from your prompt. If no text is desired, leave blank' ) } defaultValue="" label={ header.default_value } onChange={ ( val ) => setRowToEdit( { default_value: val } ) } />,

		template: <Editor description={ ( supported_variables_description + __( ' The generated text value can be retrieved in the template via the {{value}} variable. If the generator produced a JSON, you can access it using {{json_value.attribute_name}}' ) ) } defaultValue="" label={ header.template } onChange={ ( val ) => {
			setRowToEdit( { template: val } );
		} } required />,

		model: <SingleSelectMenu defaultAccept autoClose items={ aiModelsSuccess ? aiModels : {} } name="model" defaultValue="gpt-3.5-turbo-1106" onChange={ ( val ) => setRowToEdit( { model: val } ) }>{ header.model }</SingleSelectMenu>,

	} ), [ aiModels, aiModelsSuccess, rowToEdit?.shortcode_type, setRowToEdit ] );

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

