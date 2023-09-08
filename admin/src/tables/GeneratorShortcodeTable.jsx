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
	AcceptIcon,
	DisableIcon,
	CopyIcon,
	IconButton,
	RowActionButtons,
	Button,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import useAIModelsQuery from '../queries/useAIModelsQuery';
import copyToClipBoard from '../lib/copyToClipBoard';

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
					( status === 'D' ) &&
					<IconButton className="mr-s c-saturated-green"
						tooltip={ __( 'Activate' ) }
						tooltipClass="align-left" onClick={ () => onClick( 'A' ) }>
						<AcceptIcon />
					</IconButton>
				}
				{
					( status === 'A' ) &&
					<IconButton className="mr-s c-saturated-red"
						tooltip={ __( 'Disable' ) }
						tooltipClass="align-left" onClick={ () => onClick( 'D' ) }>
						<DisableIcon />
					</IconButton>
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
				title,
				paginationId,
				slug,
				header,
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
		useTablePanels.setState( () => (
			{
				rowEditorCells: { ...rowEditorCells, model: { ...rowEditorCells.model, props: { ...rowEditorCells.model.props, items: aiModels } } },
			}
		) );
	}, [ data, aiModels ] );

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
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
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
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'semantic_context', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'url_filter', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'default_value', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'template', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'model', {
			tooltip: ( cell ) => <Tooltip>{ modelTypes[ cell.getValue() ] }</Tooltip>,
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
			tooltip: ( cell ) => <Tooltip>Click to copy { cell.getValue() } to the clipboard</Tooltip>,
			cell: ( cell ) => <button className="flex" onClick={ () => copyToClipBoard( cell.getValue() ) }><CopyIcon className="mr-s" />{ cell.getValue() }</button>,
			header: header.shortcode,
			size: 250,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell } ) }
				onDelete={ () => deleteRow( { cell } ) }
			>
				<Link to="/Generator/result">
					<Button onClick={ () => {
						queryClient.setQueryData( [ 'generator/result', 'filters' ], { filters: { shortcode_id: { op: 'exactly', val: `${ cell.row.original.shortcode_id }`, keyType: 'number' } } } );
					} }
					className="mr-s small active"
					>
						{ __( 'Show results' ) }
					</Button>
				</Link>
				<IconButton
					onClick={ () => copyToClipBoard( cell.row.original.shortcode ) }
					tooltipClass="align-left"
					tooltip={ __( 'Copy shortcode to the clipboard' ) }
				>
					<CopyIcon className="mr-s" />
				</IconButton>
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
			<ModuleViewHeaderBottom
				noImport
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { semantic_context: false, url_filter: false, default_value: false, template: false, model: false } } }
				columns={ columns }
				data={
					isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
				}
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
