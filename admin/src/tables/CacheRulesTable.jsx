import { memo, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n/';
import {
	useInfiniteFetch,
	SortBy,
	Checkbox,
	InputField,
	SingleSelectMenu,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	TagsMenu,
	RowActionButtons,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';

import DescriptionBox from '../elements/DescriptionBox';

const title = __( 'Add New Cache Rule' );
const paginationId = 'rule_id';

const matchTypes = Object.freeze( {
	A: 'All pages',
	E: 'Exact match',
	S: 'Contains',
	R: 'Regular expression',
} );
const booleanValueTypes = Object.freeze( {
	Y: __( 'Yes' ),
	N: __( 'No' ),
	A: __( "Don't check" ),
} );

const header = Object.freeze( {
	match_type: __( 'Match type' ),
	match_url: __( 'Match URL' ),
	ip: __( 'Visitor IP' ),
	browser: __( 'Browser' ),
	cookie: __( 'Cookies' ),
	headers: __( 'Request headers' ),
	params: __( 'Request parameters' ),
	rule_order: __( 'Order' ),
	cache_ttl: __( 'Cache validity' ),
	is_active: __( 'Is active' ),
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
} );

export default function CacheRulesTable( { slug } ) {
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
		columnHelper.accessor( 'match_type', {
			filterValMenu: matchTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ matchTypes } name={ cell.column.id } autoClose defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'match_url', {
			className: 'nolimit',
			cell: ( cell ) => cell.row.original.match_type !== 'A' ? <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } /> : cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'ip', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
			show: false,
		} ),
		columnHelper.accessor( 'browser', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
			show: false,
		} ),
		columnHelper.accessor( 'cookie', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'headers', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'params', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'rule_order', {
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'cache_ttl', {
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'is_active', {
			className: 'nolimit',
			cell: ( cell ) => <Checkbox defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
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
				onEdit={ () => updateRow( { cell } ) }
				onDelete={ () => deleteRow( { cell } ) }
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
				{ __( "Override the default caching behavior set in the Settings tab. These customizable rules allow you to fully manage the caching headers in your WordPress installation. You have the flexibility to establish varying cache validity across different parts of your website, adjust the values for each file type, and even alter caching based on specific cookie or HTTP header parameters. It's important to arrange these rules in the correct order (refer to the Order column) since the first rule that meets the condition will be implemented on the page, rendering subsequent rules redundant. Broad conditions should be placed at the end of the list, while specific ones should be positioned at the top for effective rule enforcement." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { ip: false, browser: false, cookie: false, headers: false, params: false } } }
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
		cache_ttl: <InputField liveUpdate defaultValue="3600" label={ header.cache_ttl } section={ __( 'Caching' ) }
			description={ __( 'Cache will remain valid for the specified duration in seconds. The same value will be utilized for cache headers dispatched to the browser' ) }
			onChange={ ( val ) => setRowToEdit( { cache_ttl: val } ) } />,
		match_type: <SingleSelectMenu defaultAccept autoClose items={ matchTypes } name="match_type" defaultValue="A" section={ __( 'Conditions' ) }
			description={ __( 'Choose when the rule should be applied' ) }
			onChange={ ( val ) => {
				setRowToEdit( { match_type: val } );
				useTablePanels.setState( {
					rowEditorCells: {
						...rowEditorCells, match_url: { ...rowEditorCells.match_url, props: { ...rowEditorCells.match_url.props, disabled: val !== 'A' ? false : true, required: val !== 'A' ? true : false } } },
				} );
			}
			}
		>{ header.match_type }</SingleSelectMenu>,
		match_url: <InputField type="url" liveUpdate
			description={ __( 'Match this value with the browser URL according to the selected rule type' ) }
			label={ header.match_url } onChange={ ( val ) => setRowToEdit( { match_url: val } ) } required={ false } />,

		headers: <InputField liveUpdate label={ header.headers } defaultValue=""
			description={ __( 'Apply only for requests with specified HTTP headers sent from the browser. List the headers to be checked, separated by commas. For instance: HEADER-NAME, HEADER-NAME=value' ) }
			onChange={ ( val ) => setRowToEdit( { headers: val } ) } />,

		cookie: <InputField liveUpdate label={ header.cookie } defaultValue=""
			description={ __( 'Apply only for requests with specified cookie sent from the browser. List the cookies to be checked, separated by commas. For instance: COOKIE_NAME, COOKIE_NAME=value' ) }
			onChange={ ( val ) => setRowToEdit( { cookie: val } ) } />,

		params: <InputField liveUpdate label={ header.params } defaultValue=""
			description={ __( 'Apply only for requests with specified GET or POST parameter. List the parameters to be checked, separated by commas. For instance: query-param, query-param=value' ) }
			onChange={ ( val ) => setRowToEdit( { params: val } ) } />,

		ip: <InputField liveUpdate label={ header.ip } defaultValue=""
			description={ __( 'Apply only for visitors from certain IP addresses or subnets. Provide a comma-separated list of IP addresses or subnets. For instance: 172.120.0.*, 192.168.0.0/24' ) }
			onChange={ ( val ) => setRowToEdit( { ip: val } ) } />,

		browser: <InputField liveUpdate label={ header.browser } defaultValue=""
			description={ __( 'Apply for visitors using specific browsers. Input browser names or any string from User-Agent, separated by commas' ) }
			onChange={ ( val ) => setRowToEdit( { browser: val } ) } />,

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
			description={ __( 'hecks whether the page you are currently viewing is a paginated page other than page one. Posts and pages are paginated when you use the nextpage quicktag in your content to split up large posts.' ) }
			onChange={ ( val ) => setRowToEdit( { is_paged: val } ) }>{ header.is_paged }</SingleSelectMenu>,

		rule_order: <InputField liveUpdate defaultValue="10" label={ header.rule_order } onChange={ ( val ) => setRowToEdit( { rule_order: val } ) } />,

		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } section={ __( 'Categorize' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,
		is_active: <Checkbox defaultValue={ true } onChange={ ( val ) => setRowToEdit( { is_active: val } ) }>{ header.is_active }</Checkbox>,
	} ), [ setRowToEdit, slug ] );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ paginationId ],
			}
		) );
	}, [ rowEditorCells ] );
} );
