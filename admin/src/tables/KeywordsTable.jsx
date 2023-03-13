/* eslint-disable indent */
import { useMemo } from 'react';
import {
	useInfiniteFetch, handleSelected, SortMenu, LangMenu, InputField, Checkbox, MenuInput, Trash, Loader, Tooltip, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function KeywordsTable( { slug } ) {
	const { filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater();

	const url = useMemo( () => `${ filters }${ sortingColumn }`, [ filters, sortingColumn ] );
	const pageId = 'kw_id';

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, url, pageId } );

	// const myRowObject = {
	// 	kw_id: 0,
	// 	keyword: 'sss',
	// 	kw_priority: 11,
	// 	kw_length: 20,
	// 	lang: 'sk',
	// 	urlLink: 'https://kokot.com',
	// 	urlFilter: '.*',
	// 	kwType: 'M',
	// 	kw_usage_count: 0,
	// 	link_usage_count: 0,
	// 	destUrlMd5: 0,
	// };

	const keywordTypes = {
		M: __( 'Manual' ),
		I: __( 'Imported' ),
		X: __( 'None' ),
	};

	const header = {
		keyword: __( 'Keyword' ),
		kwType: __( 'Type' ),
		kw_length: __( 'Length' ),
		kw_priority: __( 'Priority' ),
		kw_usage_count: __( 'Usage' ),
		lang: __( 'Language' ),
		link_usage_count: __( 'Link Usage' ),
		urlFilter: __( 'URL Filter' ),
		urlLink: __( 'Link' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: null,
			enableResizing: false,
		} ),
		columnHelper.accessor( 'keyword', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: () => <MenuInput isFilter placeholder="Filter keyword" defaultValue={ currentFilters.keyword } onChange={ ( val ) => addFilter( 'keyword', val ) }>{ header.keyword }</MenuInput>,
			minSize: 150,
		} ),
		columnHelper.accessor( 'kwType', {
			className: 'nolimit',
			cell: ( cell ) => <SortMenu items={ keywordTypes } name={ cell.column.id } checkedId={ cell.getValue() } onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: ( cell ) => <SortMenu isFilter items={ keywordTypes } name={ cell.column.id } checkedId={ currentFilters.kwType || '' } onChange={ ( val ) => addFilter( 'kwType', val ) }>{ header.kwType }</SortMenu>,
			size: 100,
		} ),
		columnHelper.accessor( 'kw_length', {
			header: () => <MenuInput isFilter placeholder="Filter kw length" defaultValue={ currentFilters.kw_length } onChange={ ( val ) => addFilter( 'kw_length', val ) }>{ header.kw_length }</MenuInput>,
			size: 80,
		} ),
		columnHelper.accessor( 'kw_priority', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => <MenuInput isFilter placeholder="Filter priority" defaultValue={ currentFilters.kw_priority } onChange={ ( val ) => addFilter( 'kw_priority', val ) }>{ header.kw_length }</MenuInput>,
			size: 80,
		} ),
		columnHelper.accessor( 'lang', {
			className: 'nolimit',
			cell: ( cell ) => <LangMenu noAll checkedId={ cell?.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) }
			/>,
			header: () => <LangMenu noAll isFilter checkedId={ currentFilters.lang || 'all' } onChange={ ( val ) => addFilter( 'lang', val ) }>{ header.lang }</LangMenu>,
			size: 165,
		} ),
		columnHelper.accessor( 'kw_usage_count', {
			header: () => <MenuInput isFilter placeholder="Filter Usage count" defaultValue={ currentFilters.kw_usage_count } onChange={ ( val ) => addFilter( 'kw_usage_count', val ) }>{ header.kw_usage_count }</MenuInput>,
			size: 70,
		} ),
		columnHelper.accessor( 'link_usage_count', {
			header: () => <MenuInput isFilter placeholder="Filter URL usage" defaultValue={ currentFilters.link_usage_count } onChange={ ( val ) => addFilter( 'link_usage_count', val ) }>{ header.link_usage_count }</MenuInput>,
			size: 100,
		} ),
		columnHelper.accessor( 'urlFilter', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.renderValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => <MenuInput isFilter placeholder="Filter by URL filter" defaultValue={ currentFilters.urlFilter } onChange={ ( val ) => addFilter( 'urlFilter', val ) }>{ header.urlFilter }</MenuInput>,
			size: 100,
		} ),
		columnHelper.accessor( 'urlLink', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: () => <MenuInput isFilter placeholder="Filter URL" onChange={ ( val ) => addFilter( 'urlLink', val ) }>{ header.urlLink }</MenuInput>,
			enableResizing: false,
			size: 350,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { data, url, slug, cell, rowSelector: pageId } ) } />,
			header: null,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				slug={ slug }
				currentFilters={ currentFilters }
				header={ header }
				removeFilters={ ( key ) => removeFilters( key ) }
				onSort={ ( val ) => sortBy( val ) }
				exportOptions={ {
					url: slug,
					filters,
					fromId: `from_${ pageId }`,
					pageId,
					deleteCSVCols: [ pageId, 'dest_url_id' ],
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }>
				{ row
					? <Tooltip center>{ `${ header.keyword } “${ row.keyword }”` } { __( 'has been deleted.' ) }</Tooltip>
						: null
				}
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
