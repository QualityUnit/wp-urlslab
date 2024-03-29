import { memo, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch,
	SortBy,
	SingleSelectMenu,
	InputField,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	TagsMenu,
	TextArea,
	RowActionButtons,
	TableSelectCheckbox,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';
import RolesMenu from '../elements/RolesMenu';
import CapabilitiesMenu from '../elements/CapabilitiesMenu';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

const title = __( 'Add Custom Code' );
const paginationId = 'rule_id';

const header = {
	name: __( 'Rule name' ),
	is_active: __( 'Active rule' ),
	labels: __( 'Tags' ),
};

const editRowCells = {
	match_type: __( 'Match type' ),
	match_url: __( 'Match URL' ),
	rule_order: __( 'Order' ),
	match_headers: __( 'Request headers' ),
	match_cookie: __( 'Cookies' ),
	match_params: __( 'Request parameters' ),
	match_ip: __( 'Visitor IP' ),
	match_roles: __( 'Roles' ),
	match_capabilities: __( 'Capabilities' ),
	match_browser: __( 'Browser' ),
	is_logged: __( 'Is logged in' ),
	is_single: __( 'Is single' ),
	is_singular: __( 'Is singular' ),
	is_attachment: __( 'Is attachment' ),
	is_page: __( 'Is page' ),
	is_home: __( 'Is home' ),
	is_front_page: __( 'Is front page' ),
	is_category: __( 'Is category' ),
	is_search: __( 'Is search' ),
	is_tag: __( 'Is tag' ),
	is_author: __( 'Is author' ),
	is_archive: __( 'Is archive' ),
	is_sticky: __( 'Is sticky' ),
	is_tax: __( 'Is taxonomy' ),
	is_feed: __( 'Is feed' ),
	is_paged: __( 'Is paged' ),
	add_http_headers: __( 'Custom HTTP Headers' ),
	add_start_headers: __( 'After `<head>`' ),
	add_end_headers: __( 'Before `</head>`' ),
	add_start_body: __( 'After `<body>`' ),
	add_end_body: __( 'Before `</body>`' ),
};

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
			id: 'name',
		} );
	}, [ setTable, slug ] );

	return init && <CustomHtmlTable slug={ slug } />;
}
function CustomHtmlTable( { slug } ) {
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

	const { deleteRow, updateRow } = useChangeRow();

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'name', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" value={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'is_active', {
			className: 'nolimit',
			cell: ( cell ) => <Checkbox value={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu value={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 160,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell, id: 'name' } ) }
				onDelete={ () => deleteRow( { cell, id: 'name' } ) }
			>
			</RowActionButtons>,
			header: () => null,
			size: 0,
		} ),
	], [ columnHelper, deleteRow, slug, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table displays a list of code injection rules applied to the generated page. If the page matches the rule conditions, the HTML headers and content are supplemented with the provided HTML, CSS, or JavaScript codes. With the option to define custom rules, you can create a variety of code injection combinations based on numerous condition types. To implement a specific code onto all pages of your website, navigate to the Settings tab to establish an injection applicable to all pages.' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom />

			<Table
				className="fadeInto"
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

	const { columnTypes } = useColumnTypesQuery( slug );

	const booleanValueTypes = columnTypes?.is_single.values;

	const rowEditorCells = useMemo( () => ( {
		name: <InputField liveUpdate autoFocus type="text" defaultValue="" label={ header.name } onChange={ ( val ) => setRowToEdit( { name: val } ) } />,

		rule_order: <InputField liveUpdate type="number" defaultValue="10" label={ editRowCells.rule_order } onChange={ ( val ) => setRowToEdit( { rule_order: val } ) } />,

		is_active: <Checkbox defaultValue={ true } onChange={ ( val ) => setRowToEdit( { is_active: val } ) }>{ header.is_active }</Checkbox>,

		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,

		match_type: <SingleSelectMenu defaultAccept autoClose items={ columnTypes?.match_type.values } name="match_type" defaultValue="E"
			description={ __( 'Choose when the rule should be applied' ) }
			section={ __( 'Rule Conditions' ) }
			onChange={ ( val ) => setRowToEdit( { match_type: val } ) }>{ editRowCells.match_type }</SingleSelectMenu>,

		match_url: <InputField type="url" liveUpdate defaultValue="" label={ editRowCells.match_url } hidden={ rowToEdit?.match_type === 'A' }
			description={ __( 'Match this value with the browser URL according to the selected rule type' ) }
			onChange={ ( val ) => setRowToEdit( { match_url: val } ) } />,

		match_headers: <InputField liveUpdate defaultValue="" label={ editRowCells.match_headers }
			description={ __( 'Apply only for requests with specified HTTP headers sent from the browser. List the headers to be checked, separated by commas. For instance: HEADER-NAME, HEADER-NAME=value' ) }
			onChange={ ( val ) => setRowToEdit( { match_headers: val } ) } />,

		match_cookie: <InputField liveUpdate defaultValue="" label={ editRowCells.match_cookie }
			description={ __( 'Apply only for requests with specified cookie sent from the browser. List the cookies to be checked, separated by commas. For instance: COOKIE_NAME, COOKIE_NAME=value' ) }
			onChange={ ( val ) => setRowToEdit( { match_cookie: val } ) } />,

		match_params: <InputField liveUpdate defaultValue="" label={ editRowCells.match_params }
			description={ __( 'Apply only for requests with specified GET or POST parameter. List the parameters to be checked, separated by commas. For instance: query-param, query-param=value' ) }
			onChange={ ( val ) => setRowToEdit( { match_params: val } ) } />,

		match_roles: <RolesMenu defaultValue=""
			description={ __( 'Apply only for requests from users with particular roles' ) }
			onChange={ ( val ) => setRowToEdit( { match_roles: val } ) } />,

		match_capabilities: <CapabilitiesMenu defaultValue=""
			description={ __( 'Apply only for requests from users with certain capabilities' ) }
			onChange={ ( val ) => setRowToEdit( { match_capabilities: val } ) } />,

		match_ip: <InputField liveUpdate defaultValue="" label={ editRowCells.match_ip }
			description={ __( 'Apply only for visitors from certain IP addresses or subnets. Provide a comma-separated list of IP addresses or subnets. For instance: 172.120.0.*, 192.168.0.0/24' ) }
			onChange={ ( val ) => setRowToEdit( { match_ip: val } ) } />,

		match_browser: <InputField liveUpdate defaultValue="" label={ editRowCells.match_browser }
			description={ __( 'Apply for visitors using specific browsers. Input browser names or any string from User-Agent, separated by commas' ) }
			onChange={ ( val ) => setRowToEdit( { match_browser: val } ) } />,

		is_logged: <SingleSelectMenu autoClose items={ columnTypes?.is_logged.values } name="is_logged" defaultValue="A"
			description={ __( 'Apply only to users with a specific login status' ) }
			onChange={ ( val ) => setRowToEdit( { is_logged: val } ) }>{ editRowCells.is_logged }</SingleSelectMenu>,

		is_single: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_single" defaultValue="A"
			description={ __( 'Checks to see whether any type of single post is being displayed (excluding attachments).' ) }
			onChange={ ( val ) => setRowToEdit( { is_single: val } ) }>{ editRowCells.is_single }</SingleSelectMenu>,

		is_singular: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_singular" defaultValue="A"
			description={ __( 'Checks whether a single post, attachment or page is being displayed. True is returned if either of those conditions are met.' ) }
			onChange={ ( val ) => setRowToEdit( { is_singular: val } ) }>{ editRowCells.is_singular }</SingleSelectMenu>,

		is_attachment: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_attachment" defaultValue="A"
			description={ __( 'Checks if an attachment is displayed.' ) }
			onChange={ ( val ) => setRowToEdit( { is_attachment: val } ) }>{ editRowCells.is_attachment }</SingleSelectMenu>,

		is_page: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_page" defaultValue="A"
			description={ __( 'Checks if a page is being displayed.' ) }
			onChange={ ( val ) => setRowToEdit( { is_page: val } ) }>{ editRowCells.is_page }</SingleSelectMenu>,

		is_home: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_home" defaultValue="A"
			description={ __( 'Checks if the blog post index is being displayed. This may or may not be your home page as well.' ) }
			onChange={ ( val ) => setRowToEdit( { is_home: val } ) }>{ editRowCells.is_home }</SingleSelectMenu>,

		is_front_page: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_front_page" defaultValue="A"
			description={ __( 'Checks if your home page is being displayed. This works whether your front page settings are set up to display blog posts (i.e. blog index) or a static page.' ) }
			onChange={ ( val ) => setRowToEdit( { is_front_page: val } ) }>{ editRowCells.is_front_page }</SingleSelectMenu>,

		is_category: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_category" defaultValue="A"
			description={ __( 'Checks whether a category archive page is being displayed.' ) }
			onChange={ ( val ) => setRowToEdit( { is_category: val } ) }>{ editRowCells.is_category }</SingleSelectMenu>,

		is_search: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_search" defaultValue="A"
			description={ __( 'Checks if a search results page is being shown.' ) }
			onChange={ ( val ) => setRowToEdit( { is_search: val } ) }>{ editRowCells.is_search }</SingleSelectMenu>,

		is_tag: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_tag" defaultValue="A"
			description={ __( 'Checks whether a tag archive is being displayed.' ) }
			onChange={ ( val ) => setRowToEdit( { is_tag: val } ) }>{ editRowCells.is_tag }</SingleSelectMenu>,

		is_author: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_author" defaultValue="A"
			description={ __( 'Checks if an author archive page is being displayed.' ) }
			onChange={ ( val ) => setRowToEdit( { is_author: val } ) }>{ editRowCells.is_author }</SingleSelectMenu>,

		is_archive: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_archive" defaultValue="A"
			description={ __( 'Checks if any type of archive page is being displayed including category, tag, date and author archives.' ) }
			onChange={ ( val ) => setRowToEdit( { is_archive: val } ) }>{ editRowCells.is_archive }</SingleSelectMenu>,

		is_sticky: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_sticky" defaultValue="A"
			description={ __( 'Checks if a post defined as sticky is displayed.' ) }
			onChange={ ( val ) => setRowToEdit( { is_sticky: val } ) }>{ editRowCells.is_sticky }</SingleSelectMenu>,

		is_tax: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_tax" defaultValue="A"
			description={ __( 'Checks whether a custom taxonomy archive page is displayed.' ) }
			onChange={ ( val ) => setRowToEdit( { is_tax: val } ) }>{ editRowCells.is_tax }</SingleSelectMenu>,

		is_feed: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_feed" defaultValue="A"
			description={ __( 'Checks whether the current query is for a feed.' ) }
			onChange={ ( val ) => setRowToEdit( { is_feed: val } ) }>{ editRowCells.is_feed }</SingleSelectMenu>,

		is_paged: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_paged" defaultValue="A"
			description={ __( 'hecks whether the page you are currently viewing is a paginated page other than page one. Posts and pages are paginated when you use the nextpage quicktag in your content to split up large posts.' ) }
			onChange={ ( val ) => setRowToEdit( { is_paged: val } ) }>{ editRowCells.is_paged }</SingleSelectMenu>,

		add_http_headers: <TextArea rows="5" liveUpdate defaultValue="" label={ editRowCells.add_http_headers }
			description={ __( 'Add custom HTTP headers transmitted from the server to the browser. Use new lines to separate headers. For instance: X-URLSLAB-HEADER=value' ) }
			section={ __( 'Inject Code' ) }
			onChange={ ( val ) => setRowToEdit( { add_http_headers: val } ) } />,

		add_start_headers: <TextArea rows="5" liveUpdate defaultValue="" label={ editRowCells.add_start_headers }
			description={ __( 'Custom HTML code inserted immediately after the opening `<head>` tag, applicable to all pages' ) }
			onChange={ ( val ) => setRowToEdit( { add_start_headers: val } ) } />,

		add_end_headers: <TextArea rows="5" liveUpdate defaultValue="" label={ editRowCells.add_end_headers }
			description={ __( 'Custom HTML code inserted immediately before the closing `</head>` tag, applicable to all pages' ) }
			onChange={ ( val ) => setRowToEdit( { add_end_headers: val } ) } />,

		add_start_body: <TextArea rows="5" liveUpdate defaultValue="" label={ editRowCells.add_start_body }
			description={ __( 'Custom HTML code inserted immediately after the opening `<body>` tag, applicable to all pages' ) }
			onChange={ ( val ) => setRowToEdit( { add_start_body: val } ) } />,

		add_end_body: <TextArea rows="5" liveUpdate defaultValue="" label={ editRowCells.add_end_body }
			description={ __( 'Custom HTML code inserted immediately before the closing `</body>` tag, applicable to all pages' ) }
			onChange={ ( val ) => setRowToEdit( { add_end_body: val } ) } />,

	} ), [ slug, columnTypes?.match_type, columnTypes?.is_logged, booleanValueTypes, rowToEdit?.match_type, setRowToEdit ] );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
	}, [ rowEditorCells ] );
} );
