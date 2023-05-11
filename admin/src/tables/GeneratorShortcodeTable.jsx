import {
	useInfiniteFetch,
	Tooltip,
	Checkbox,
	Trash,
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
	Edit,
	Editor,
} from '../lib/tableImports';

import IconButton from '../elements/IconButton';
import { ReactComponent as AcceptIcon } from '../assets/images/icons/icon-activate.svg';
import { ReactComponent as DisableIcon } from '../assets/images/icons/icon-disable.svg';
import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function GeneratorShortcodeTable( { slug } ) {
	const paginationId = 'shortcode_id';
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( 'generator/shortcode' );

	const url = { filters, sorting };

	const ActionButton = ( { cell, onClick } ) => {
		const { status } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( status === 'D' ) &&
					<IconButton className="mr-s c-saturated-green" tooltip={ __( 'Activate' ) } tooltipClass="align-left" onClick={ () => onClick( 'A' ) }>
						<AcceptIcon />
					</IconButton>
				}
				{
					( status === 'A' ) &&
					<IconButton className="mr-s c-saturated-red" tooltip={ __( 'Disable' ) } tooltipClass="align-left" onClick={ () => onClick( 'D' ) }>
						<DisableIcon />
					</IconButton>
				}
			</div>
		);
	};

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, url, paginationId, filters, sorting } );

	const { row, selectedRows, selectRow, rowToEdit, setEditorRow, activePanel, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	console.log( rowToEdit );

	const statusTypes = {
		A: __( 'Active' ),
		D: __( 'Disabled' ),
	};
	const modelTypes = {
		'gpt-3.5-turbo': __( 'Gpt 3.5 Turbo' ),
		'gpt-4': __( 'Gpt 4' ),
		'text-davinci-003': __( 'Text Davinci 003' ),
	};
	const shortcodeTypeTypes = {
		S: __( 'Semantic search' ),
		V: __( 'Video context' ),
	};

	const header = {
		shortcode_id: __( 'Id' ),
		shortcode_type: __( 'Generator Type' ),
		prompt: __( 'Prompt' ),
		semantic_context: __( 'Semantic search query' ),
		url_filter: __( 'URL filter' ),
		default_value: __( 'Default value' ),
		status: __( 'Status' ),
		date_changed: __( 'Last change' ),
		model: __( 'Model' ),
		template: __( 'HTML template' ),
		usage_count: __( 'Usage' ),
	};

	const supported_variables_description = __( 'Supported variables: {{page_title}}, {{page_url}}, {{domain}}, {{language_code}}, {{language}}. In case videoid attribute is set, following variables are available: {{video_captions}}, {{video_title}}, {{video_description}}, {{video_published_at}}, {{video_duration}}, {{video_channel_title}}, {{video_tags}}. Custom attributes can be passed from shortcode as well in form {{your_custom_attribute_name}}' );

	const rowEditorCells = {
		shortcode_type: <SingleSelectMenu autoClose defaultAccept description={ __( 'In case of video context type, Semantic search query should contain YouTube videoid or YoutTube video url.' ) }
			items={ shortcodeTypeTypes } name="shortcode_type" defaultValue="S" onChange={ ( val ) => setEditorRow( { ...rowToEdit, shortcode_type: val } ) }>{ header.shortcode_type }</SingleSelectMenu>,
		prompt: <TextArea rows="5" description={ ( supported_variables_description ) }
			liveUpdate defaultValue="" label={ header.prompt } onChange={ ( val ) => setEditorRow( { ...rowToEdit, prompt: val } ) } required />,
		semantic_context: <InputField liveUpdate description={ ( supported_variables_description + ' ' + __( 'In case of video context type, Semantic search query should contain youtube videoid: {{videoid}}.' ) ) }
			defaultValue="" label={ header.semantic_context } onChange={ ( val ) => setEditorRow( { ...rowToEdit, semantic_context: val } ) } hidden={ rowToEdit?.shortcode_type === 'V' } />,
		url_filter: <InputField liveUpdate defaultValue="" description={ __( 'Recommended variables: {{page_url}} if you need to generate data from current url. {{domain}} if you need to generate data from any semanticaly relevant page in your domain. Fixed url if you need to generate data from fixed url (e.g. http://wikipedia.com/anything). {{custom_url_attribute_name}} if you pass your custom attribute to shortcode in html template.' ) } label={ header.url_filter } onChange={ ( val ) => setEditorRow( { ...rowToEdit, url_filter: val } ) } hidden={ rowToEdit?.shortcode_type === 'V' } />,
		default_value: <InputField liveUpdate description={ __( 'Put here the text, which shoould be displayed in shortcode until Urlslab generates text from your prompt. Leave empty if you do not want to display shortcode until the text is generated' ) } defaultValue="" label={ header.default_value } onChange={ ( val ) => setEditorRow( { ...rowToEdit, default_value: val } ) } />,
		template: <Editor description={ ( supported_variables_description + __( ' Value of generated text can be accessed in template by variable {{value}} or if generator generated json {{json_value.attribute_name}}' ) ) } defaultValue="" label={ header.template } onChange={ ( val ) => setEditorRow( { ...rowToEdit, template: val } ) } required />,
		model: <SingleSelectMenu defaultAccept autoClose items={ modelTypes } name="model" defaultValue={ ( 'gpt-3.5-turbo' ) } onChange={ ( val ) => setEditorRow( { ...rowToEdit, model: val } ) }>{ header.model }</SingleSelectMenu>,
	};
	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'shortcode_type', {
			filterValMenu: shortcodeTypeTypes,
			className: 'nolimit',
			cell: ( cell ) => shortcodeTypeTypes[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.shortcode_type }</SortBy>,
			size: 150,
		} ),
		columnHelper.accessor( 'prompt', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.prompt }</SortBy>,
			size: 180,
		} ),
		columnHelper.accessor( 'semantic_context', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.semantic_context }</SortBy>,
			size: 180,
		} ),
		columnHelper.accessor( 'default_value', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.default_value }</SortBy>,
			size: 180,
		} ),
		columnHelper.accessor( 'url_filter', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_filter }</SortBy>,
			size: 180,
		} ),
		columnHelper.accessor( 'template', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.template }</SortBy>,
			size: 180,
		} ),
		columnHelper.accessor( 'model', {
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.model }</SortBy>,
			size: 180,
		} ),
		columnHelper.accessor( 'status', {
			filterValMenu: statusTypes,
			className: 'nolimit',
			cell: ( cell ) => statusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.status }</SortBy>,
			size: 150,
		} ),
		columnHelper.accessor( 'date_changed', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.date_changed }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'usage_count', {
			header: header.usage_count,
			size: 100,
		} ),
		columnHelper.accessor( 'actions', {
			className: 'actions hoverize nolimit',
			cell: ( cell ) => <ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'status', newVal: val, cell } ) } />,
			header: null,
			size: 70,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => {
				return (
					<div className="flex">
						<IconButton
							onClick={ () => updateRow( { cell } ) }
							tooltipClass="align-left xxxl"
							tooltip={ __( 'Edit row' ) }
						>
							<Edit />
						</IconButton>
						<IconButton
							className="ml-s"
							onClick={ () => deleteRow( { cell } ) }
							tooltipClass="align-left xxxl"
							tooltip={ __( 'Delete row' ) }
						>
							<Trash />
						</IconButton>
					</div>
				);
			},
			header: null,
			size: 60,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				slug={ slug }
				header={ header }
				table={ table }
				noImport
				selectedRows={ selectedRows }
				onDeleteSelected={ deleteSelectedRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				onUpdateRow={ ( val ) => {
					setEditorRow();
					if ( val === 'rowInserted' || val === 'rowChanged' ) {
						setEditorRow( val );
						setTimeout( () => {
							setEditorRow();
						}, 3000 );
					}
				} }
				activatePanel={ activePanel }
				rowEditorOptions={ { rowEditorCells, title: 'Add generator', data, slug, url, paginationId, rowToEdit } }
				exportOptions={ {
					slug,
					url,
					paginationId,
					deleteCSVCols: [ paginationId, 'shortcode_id' ],
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				columns={ columns }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				data={
					isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
				}
			>
				{ row
					? <Tooltip center>{ __( 'Item has been deleted.' ) }</Tooltip>
					: null
				}
				{ ( rowToEdit === 'rowChanged' )
					? <Tooltip center>{ __( 'Shortcode has been changed.' ) }</Tooltip>
					: null
				}
				{ ( rowToEdit === 'rowInserted' )
					? <Tooltip center>{ __( 'Shortcode has been added.' ) }</Tooltip>
					: null
				}
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
