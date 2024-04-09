import { memo, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch,
	SortBy,
	SingleSelectMenu,
	InputField,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	TagsMenu,
	RowActionButtons,
	TableSelectCheckbox,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

const title = __( 'Add New Replacement', 'urlslab' );
const paginationId = 'id';
const header = {
	str_search: __( 'Search string (old)', 'urlslab' ),
	str_replace: __( 'Replace string (new)', 'urlslab' ),
	search_type: __( 'Search type', 'urlslab' ),
	login_status: __( 'Is logged in', 'urlslab' ),
	url_filter: __( 'URL filter', 'urlslab' ),
	labels: __( 'Tags', 'urlslab' ),
};
const editRowCells = {
	is_single: __( 'Is single', 'urlslab' ),
	is_singular: __( 'Is singular', 'urlslab' ),
	is_attachment: __( 'Is attachment', 'urlslab' ),
	is_page: __( 'Is page', 'urlslab' ),
	is_home: __( 'Is home', 'urlslab' ),
	is_front_page: __( 'Is front page', 'urlslab' ),
	is_category: __( 'Is category', 'urlslab' ),
	is_search: __( 'Is search', 'urlslab' ),
	is_tag: __( 'Is tag', 'urlslab' ),
	is_author: __( 'Is author', 'urlslab' ),
	is_archive: __( 'Is archive', 'urlslab' ),
	is_sticky: __( 'Is sticky', 'urlslab' ),
	is_tax: __( 'Is taxonomy', 'urlslab' ),
	is_feed: __( 'Is feed', 'urlslab' ),
	is_paged: __( 'Is paged', 'urlslab' ),
};
const initialState = { columnVisibility: { login_status: false } };

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
			id: 'str_search',
		} );
	}, [ setTable, slug ] );

	return init && <SearchReplaceTable slug={ slug } />;
}

function SearchReplaceTable( { slug } ) {
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

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'str_search', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" value={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'str_replace', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" value={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'search_type', {
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu autoClose items={ columnTypes?.search_type?.values } name={ cell.column.id } value={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'login_status', {
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu autoClose items={ columnTypes.login_status?.values } name={ cell.column.id } value={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'url_filter', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" value={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
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
				onEdit={ () => updateRow( { cell, id: 'str_search' } ) }
				onDelete={ () => deleteRow( { cell, id: 'str_search' } ) }
			>
			</RowActionButtons>,
			header: () => null,
			size: 0,
		} ),
	], [ columnHelper, columnTypes, deleteRow, slug, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading || isLoadingColumnTypes ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table', 'urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The table lists HTML replacement rules. These rules are applied to all HTML requests in real time as the page content is generated. When the conditions of a rule are met, all corresponding strings will be replaced according to that rule's definition. Please note that this process occurs dynamically and does not alter the original content in the database. If the module or a specific rule is deactivated, the plugin will revert to displaying the original content.", 'urlslab' ) }
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
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const { columnTypes } = useColumnTypesQuery( slug );

	const rowEditorCells = useMemo( () => ( {
		search_type: <SingleSelectMenu defaultAccept autoClose items={ columnTypes?.search_type?.values } name="search_type" defaultValue="T"
			section={ __( 'Search and Replace', 'urlslab' ) }
			description={ __( 'Choose the method for string matching', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { search_type: val } ) }>{ header.search_type }</SingleSelectMenu>,

		str_search: <InputField liveUpdate type="url" defaultValue="" label={ header.str_search }
			description={ __( 'Enter a string or regular expression for replacement', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { str_search: val } ) } required />,

		str_replace: <InputField liveUpdate type="url" defaultValue="" label={ header.str_replace }
			description={ __( 'Enter a substitute string', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { str_replace: val } ) } required />,

		url_filter: <InputField liveUpdate defaultValue=".*" label={ header.url_filter }
			section={ __( 'Rule Conditions', 'urlslab' ) }
			description={ __( 'Optionally, you can permit replacement only on URLs that match a specific regular expression. Use value `.*` to match all URLs', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { url_filter: val } ) } />,

		is_single: <SingleSelectMenu autoClose items={ columnTypes?.is_single.values } name="is_single" defaultValue="A"
			description={ __( 'Checks to see whether any type of single post is being displayed (excluding attachments).', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_single: val } ) }>{ editRowCells.is_single }</SingleSelectMenu>,

		is_singular: <SingleSelectMenu autoClose items={ columnTypes?.is_singular.values } name="is_singular" defaultValue="A"
			description={ __( 'Checks whether a single post, attachment or page is being displayed. True is returned if either of those conditions are met.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_singular: val } ) }>{ editRowCells.is_singular }</SingleSelectMenu>,

		is_attachment: <SingleSelectMenu autoClose items={ columnTypes?.is_attachment.values } name="is_attachment" defaultValue="A"
			description={ __( 'Checks if an attachment is displayed.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_attachment: val } ) }>{ editRowCells.is_attachment }</SingleSelectMenu>,

		is_page: <SingleSelectMenu autoClose items={ columnTypes?.is_page.values } name="is_page" defaultValue="A"
			description={ __( 'Checks if a page is being displayed.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_page: val } ) }>{ editRowCells.is_page }</SingleSelectMenu>,

		is_home: <SingleSelectMenu autoClose items={ columnTypes?.is_home.values } name="is_home" defaultValue="A"
			description={ __( 'Checks if the blog post index is being displayed. This may or may not be your home page as well.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_home: val } ) }>{ editRowCells.is_home }</SingleSelectMenu>,

		is_front_page: <SingleSelectMenu autoClose items={ columnTypes?.is_front_page.values } name="is_front_page" defaultValue="A"
			description={ __( 'Checks if your home page is being displayed. This works whether your front page settings are set up to display blog posts (i.e. blog index) or a static page.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_front_page: val } ) }>{ editRowCells.is_front_page }</SingleSelectMenu>,

		is_category: <SingleSelectMenu autoClose items={ columnTypes?.is_category.values } name="is_category" defaultValue="A"
			description={ __( 'Checks whether a category archive page is being displayed.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_category: val } ) }>{ editRowCells.is_category }</SingleSelectMenu>,

		is_search: <SingleSelectMenu autoClose items={ columnTypes?.is_search.values } name="is_search" defaultValue="A"
			description={ __( 'Checks if a search results page is being shown.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_search: val } ) }>{ editRowCells.is_search }</SingleSelectMenu>,

		is_tag: <SingleSelectMenu autoClose items={ columnTypes?.is_tag.values } name="is_tag" defaultValue="A"
			description={ __( 'Checks whether a tag archive is being displayed.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_tag: val } ) }>{ editRowCells.is_tag }</SingleSelectMenu>,

		is_author: <SingleSelectMenu autoClose items={ columnTypes?.is_author.values } name="is_author" defaultValue="A"
			description={ __( 'Checks if an author archive page is being displayed.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_author: val } ) }>{ editRowCells.is_author }</SingleSelectMenu>,

		is_archive: <SingleSelectMenu autoClose items={ columnTypes?.is_archive.values } name="is_archive" defaultValue="A"
			description={ __( 'Checks if any type of archive page is being displayed including category, tag, date and author archives.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_archive: val } ) }>{ editRowCells.is_archive }</SingleSelectMenu>,

		is_sticky: <SingleSelectMenu autoClose items={ columnTypes?.is_sticky.values } name="is_sticky" defaultValue="A"
			description={ __( 'Checks if a post defined as sticky is displayed.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_sticky: val } ) }>{ editRowCells.is_sticky }</SingleSelectMenu>,

		is_tax: <SingleSelectMenu autoClose items={ columnTypes?.is_tax.values } name="is_tax" defaultValue="A"
			description={ __( 'Checks whether a custom taxonomy archive page is displayed.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_tax: val } ) }>{ editRowCells.is_tax }</SingleSelectMenu>,

		is_feed: <SingleSelectMenu autoClose items={ columnTypes?.is_feed.values } name="is_feed" defaultValue="A"
			description={ __( 'Checks whether the current query is for a feed.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_feed: val } ) }>{ editRowCells.is_feed }</SingleSelectMenu>,

		is_paged: <SingleSelectMenu autoClose items={ columnTypes?.is_paged.values } name="is_paged" defaultValue="A"
			description={ __( 'Checks whether the page you are currently viewing is a paginated page other than page one. Posts and pages are paginated when you use the nextpage quicktag in your content to split up large posts.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { is_paged: val } ) }>{ editRowCells.is_paged }</SingleSelectMenu>,

		login_status: <SingleSelectMenu defaultAccept autoClose items={ columnTypes?.login_status.values } name="login_status" defaultValue="A"
			description={ __( 'Checks weather user is logged in.', 'urlslab' ) }
			onChange={ ( val ) => setRowToEdit( { login_status: val } ) }>{ header.login_status }</SingleSelectMenu>,

		labels: <TagsMenu optionItem label={ __( 'Tags:', 'urlslab' ) } section={ __( 'Categorize Rule', 'urlslab' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,

	} ), [ columnTypes?.is_archive.values, columnTypes?.is_attachment.values, columnTypes?.is_author.values, columnTypes?.is_category.values, columnTypes?.is_feed.values, columnTypes?.is_front_page.values, columnTypes?.is_home.values, columnTypes?.is_page.values, columnTypes?.is_paged.values, columnTypes?.is_search.values, columnTypes?.is_single.values, columnTypes?.is_singular.values, columnTypes?.is_sticky.values, columnTypes?.is_tag.values, columnTypes?.is_tax.values, columnTypes?.login_status.values, columnTypes?.search_type?.values, setRowToEdit, slug ] );

	useEffect( () => {
		useTablePanels.setState( ( ) => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
	}, [ rowEditorCells ] );
} );
