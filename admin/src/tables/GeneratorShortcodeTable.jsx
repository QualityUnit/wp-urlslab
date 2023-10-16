import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import {
	useInfiniteFetch,
	Tooltip,
	Checkbox,
	ProgressBar,
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

export default function GeneratorShortcodeTable( { slug } ) {
	const { __ } = useI18n();
	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();
	const title = __( 'Add New Shortcode' );
	const paginationId = 'shortcode_id';
	const queryClient = useQueryClient();

	const ActionButton = ( { cell, onClick } ) => {
		const { status } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( status !== 'A' ) &&
					<Tooltip title={ __( 'Activate' ) }>
						<IconButton size="xs" color="success" onClick={ () => onClick( 'A' ) }>
							<SvgIcon name="activate" />
						</IconButton>
					</Tooltip>
				}
				{
					( status !== 'D' ) &&
					<Tooltip title={ __( 'Disable' ) }>
						<IconButton size="xs" color="danger" onClick={ () => onClick( 'D' ) }>
							<SvgIcon name="disable" />
						</IconButton>
					</Tooltip>
				}
			</div>
		);
	};

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

	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const statusTypes = {
		A: __( 'Active' ),
		D: __( 'Disabled' ),
	};
	const modelTypes = {
		'gpt-3.5-turbo': __( 'OpenAI GPT 3.5 Turbo' ),
		'gpt-4': __( 'OpenAI GPT 4' ),
		'text-davinci-003': __( 'OpenAI GPT Davinci 003' ),
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

	const supported_variables_description = __( 'Supported variables: {{page_title}}, {{page_url}}, {{domain}}, {{language_code}}, {{language}}. If the `videoid` attribute is enabled, the following variables can be used: {{video_captions}}, {{video_captions_text}}, {{video_title}}, {{video_description}}, {{video_published_at}}, {{video_duration}}, {{video_channel_title}}, {{video_tags}}. Custom attributes can also be incorporated via shortcode in the form {{your_custom_attribute_name}}' );

	const rowEditorCells = {
		shortcode_name: <InputField liveUpdate defaultValue="" description={ __( 'Shortcode name for simple identification' ) } label={ header.shortcode_name } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, shortcode_name: val } ) } required />,

		shortcode_type: <SingleSelectMenu autoClose defaultAccept description={ __( 'For video context types, the semantic search query should include a YouTube video ID or YouTube video URL' ) }
			items={ shortcodeTypeTypes } name="shortcode_type" defaultValue="S" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, shortcode_type: val } ) }>{ header.shortcode_type }</SingleSelectMenu>,

		prompt: <TextArea rows="5" description={ ( supported_variables_description ) }
			liveUpdate defaultValue="" label={ header.prompt } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, prompt: val } ) } required />,

		semantic_context: <InputField liveUpdate description={ ( supported_variables_description + ' ' + __( 'For video context types, the semantic context must include the YouTube video ID: {{videoid}}' ) ) }
			defaultValue="" label={ header.semantic_context } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, semantic_context: val } ) } hidden={ rowToEdit?.shortcode_type === 'V' } />,

		url_filter: <InputField liveUpdate defaultValue="" description={ __( 'Suggested variables: {{page_url}} for generating data from the current URL. {{domain}} for generating data from any semantically relevant page on your domain. Use a fixed URL for generating data from a specific URL. {{custom_url_attribute_name}} if a custom attribute is forwarded to the shortcode in the HTML template' ) } label={ header.url_filter } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, url_filter: val } ) } hidden={ rowToEdit?.shortcode_type === 'V' } />,

		default_value: <InputField liveUpdate description={ __( 'Enter the text to be shown in the shortcode prior to URLsLab generating text from your prompt. If no text is desired, leave blank' ) } defaultValue="" label={ header.default_value } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, default_value: val } ) } />,

		template: <Editor description={ ( supported_variables_description + __( ' The generated text value can be retrieved in the template via the {{value}} variable. If the generator produced a JSON, you can access it using {{json_value.attribute_name}}' ) ) } defaultValue="" label={ header.template } onChange={ ( val ) => {
			setRowToEdit( { ...rowToEdit, template: val } );
		} } required />,

		model: <SingleSelectMenu defaultAccept autoClose items={ aiModelsSuccess ? aiModels : {} } name="model" defaultValue={ ( 'gpt-3.5-turbo' ) } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, model: val } ) }>{ header.model }</SingleSelectMenu>,
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId ],
			}
		) );
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

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: { ...useTableStore.getState().tables, [ slug ]: { ...useTableStore.getState().tables[ slug ], data } },
			}
		) );
		useTablePanels.setState( () => (
			{
				rowEditorCells: { ...rowEditorCells, model: { ...rowEditorCells.model, props: { ...rowEditorCells.model.props, items: aiModels } } },
			}
		) );
	}, [ data, slug, aiModels ] );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
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
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'Learn more…' ) } isMainTableDescription>
				{ __( "The AI Generator shortcode defines the text generation process within a specific shortcode location. These shortcodes can be incorporated within a WordPress template or added as a single code in the page editor. As soon as the shortcode appears on the page and text is generated, it's replaced by the actual text. When the shortcode is shown for the first time, it's replaced with blank text and a new generator task is dispatched to a queue. This process can even take several days until all texts are created. In Settings tab, there's the option to have all new text pending for approval or approved right away. To view entries with this status, simply use the filter. Approve each entry individually for them to appear on your website. If not approved, these texts won't be publicly visible on your site." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noImport
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { semantic_context: false, url_filter: false, default_value: false, template: false, model: false } } }
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
		</>
	);
}
