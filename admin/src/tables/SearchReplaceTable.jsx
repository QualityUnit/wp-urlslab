import { memo, useEffect, useMemo } from 'react';
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
	RowActionButtons,
	TextArea,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';

const title = __( 'Add New Replacement' );
const paginationId = 'id';

const searchTypes = {
	T: __( 'Plain text' ),
	R: __( 'Regular expression' ),
};

const loginStatuses = {
	A: __( 'Any' ),
	L: __( 'Logged in' ),
	O: __( 'Not logged in' ),
};
const booleanValueTypes = Object.freeze( {
	Y: __('Yes'),
	N: __('No'),
	A: __("Don't check"),
} );

const header = {
	str_search: __( 'Search string (old)' ),
	str_replace: __( 'Replace string (new)' ),
	search_type: __( 'Search type' ),
	login_status: __( 'Is logged in' ),
	url_filter: 'URL filter',
	labels: __( 'Tags' ),
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
};

export default function SearchReplaceTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

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
						id: 'str_search',
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
		columnHelper.accessor( 'str_search', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'str_replace', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'search_type', {
			filterValMenu: searchTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu autoClose items={ searchTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'login_status', {
			filterValMenu: loginStatuses,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu autoClose items={ loginStatuses } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'url_filter', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
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
	], [ columnHelper, deleteRow, selectRows, slug, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The table lists HTML replacement rules. These rules are applied to all HTML requests in real time as the page content is generated. When the conditions of a rule are met, all corresponding strings will be replaced according to that rule's definition. Please note that this process occurs dynamically and does not alter the original content in the database. If the module or a specific rule is deactivated, the plugin will revert to displaying the original content." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { login_status: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
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

	const rowEditorCells = useMemo( () => ( {
		search_type: <SingleSelectMenu defaultAccept autoClose items={ searchTypes } name="search_type" defaultValue="T"
									   section={ __("Search and Replace") }
			description={ __( 'Choose the method for string matching' ) }
			onChange={ ( val ) => setRowToEdit( { search_type: val } ) }>{ header.search_type }</SingleSelectMenu>,

		str_search: <InputField liveUpdate type="url" defaultValue="" label={ header.str_search }
			description={ __( 'Enter a string or regular expression for replacement' ) }
			onChange={ ( val ) => setRowToEdit( { str_search: val } ) } required />,

		str_replace: <InputField liveUpdate type="url" defaultValue="" label={ header.str_replace }
			description={ __( 'Enter a substitute string' ) }
			onChange={ ( val ) => setRowToEdit( { str_replace: val } ) } required />,

		url_filter: <InputField liveUpdate defaultValue=".*" label={ header.url_filter }
			section={ __("Rule Conditions") }
			description={ __( 'Optionally, you can permit replacement only on URLs that match a specific regular expression. Use value `.*` to match all URLs' ) }
			onChange={ ( val ) => setRowToEdit( { url_filter: val } ) } />,

		is_single: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_single" defaultValue="A"
									 description={ __( 'Checks to see whether any type of single post is being displayed (excluding attachments).' ) }
									 onChange={ ( val ) => setRowToEdit( { is_single: val } ) }>{ header.is_single }</SingleSelectMenu>,

		is_singular: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_singular" defaultValue="A"
									   description={ __( 'Checks whether a single post, attachment or page is being displayed. True is returned if either of those conditions are met.' ) }
									   onChange={ ( val ) => setRowToEdit( { is_singular: val } ) }>{ header.is_singular }</SingleSelectMenu>,

		is_attachment: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_attachment" defaultValue="A"
										 description={ __( 'Checks if an attachment is displayed.' ) }
										 onChange={ ( val ) => setRowToEdit( { is_attachment: val } ) }>{ header.is_attachment }</SingleSelectMenu>,

		is_page: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_page" defaultValue="A"
								   description={ __( 'Checks if a page is being displayed.' ) }
								   onChange={ ( val ) => setRowToEdit( { is_page: val } ) }>{ header.is_page }</SingleSelectMenu>,

		is_home: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_home" defaultValue="A"
								   description={ __( 'Checks if the blog post index is being displayed. This may or may not be your home page as well.' ) }
								   onChange={ ( val ) => setRowToEdit( { is_home: val } ) }>{ header.is_home }</SingleSelectMenu>,

		is_front_page: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_front_page" defaultValue="A"
										 description={ __( 'Checks if your home page is being displayed. This works whether your front page settings are set up to display blog posts (i.e. blog index) or a static page.' ) }
										 onChange={ ( val ) => setRowToEdit( { is_front_page: val } ) }>{ header.is_front_page }</SingleSelectMenu>,

		is_category: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_category" defaultValue="A"
									   description={ __( 'Checks whether a category archive page is being displayed.' ) }
									   onChange={ ( val ) => setRowToEdit( { is_category: val } ) }>{ header.is_category }</SingleSelectMenu>,

		is_search: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_search" defaultValue="A"
									 description={ __( 'Checks if a search results page is being shown.' ) }
									 onChange={ ( val ) => setRowToEdit( { is_search: val } ) }>{ header.is_search }</SingleSelectMenu>,

		is_tag: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_tag" defaultValue="A"
								  description={ __( 'Checks whether a tag archive is being displayed.' ) }
								  onChange={ ( val ) => setRowToEdit( { is_tag: val } ) }>{ header.is_tag }</SingleSelectMenu>,

		is_author: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_author" defaultValue="A"
									 description={ __( 'Checks if an author archive page is being displayed.' ) }
									 onChange={ ( val ) => setRowToEdit( { is_author: val } ) }>{ header.is_author }</SingleSelectMenu>,

		is_archive: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_archive" defaultValue="A"
									  description={ __( 'Checks if any type of archive page is being displayed including category, tag, date and author archives.' ) }
									  onChange={ ( val ) => setRowToEdit( { is_archive: val } ) }>{ header.is_archive }</SingleSelectMenu>,

		is_sticky: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_sticky" defaultValue="A"
									 description={ __( 'Checks if a post defined as sticky is displayed.' ) }
									 onChange={ ( val ) => setRowToEdit( { is_sticky: val } ) }>{ header.is_sticky }</SingleSelectMenu>,

		is_tax: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_tax" defaultValue="A"
								  description={ __( 'Checks whether a custom taxonomy archive page is displayed.' ) }
								  onChange={ ( val ) => setRowToEdit( { is_tax: val } ) }>{ header.is_tax }</SingleSelectMenu>,

		is_feed: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_feed" defaultValue="A"
								   description={ __( 'Checks whether the current query is for a feed.' ) }
								   onChange={ ( val ) => setRowToEdit( { is_feed: val } ) }>{ header.is_feed }</SingleSelectMenu>,

		is_paged: <SingleSelectMenu autoClose items={ booleanValueTypes } name="is_paged" defaultValue="A"
									description={ __( 'Checks whether the page you are currently viewing is a paginated page other than page one. Posts and pages are paginated when you use the nextpage quicktag in your content to split up large posts.' ) }
									onChange={ ( val ) => setRowToEdit( { is_paged: val } ) }>{ header.is_paged }</SingleSelectMenu>,

		login_status: <SingleSelectMenu defaultAccept autoClose items={ loginStatuses } name="login_status" defaultValue="A"
			description={ __( 'Checks weather user is logged in.' ) }
			onChange={ ( val ) => setRowToEdit( { login_status: val } ) }>{ header.login_status }</SingleSelectMenu>,

		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } section={ __("Categorize Rule") } slug={ slug } onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,

	} ), [ setRowToEdit, slug ] );

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
