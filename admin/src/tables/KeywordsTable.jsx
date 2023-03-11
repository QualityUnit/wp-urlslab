/* eslint-disable indent */

import {
	useInfiniteFetch, handleSelected, RangeSlider, SortMenu, LangMenu, InputField, Checkbox, MenuInput, Trash, Loader, Tooltip, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function KeywordsTable( { slug } ) {
	const { filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater();

	const url = `${ filters }${ sortingColumn }`;
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

	const keywordTypes = {
		M: __( 'Manual' ),
		I: __( 'Imported' ),
		X: __( 'None' ),
	};

	const header = {
		kw_id: __( 'None' ),
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
			header: () => <MenuInput isFilter placeholder="Enter keyword" defaultValue={ currentFilters.keyword } onChange={ ( val ) => addFilter( 'keyword', val ) }>{ header.keyword }</MenuInput>,
			minSize: 150,
		} ),
		columnHelper.accessor( 'kwType', {
			className: 'nolimit',
			cell: ( cell ) => <SortMenu items={ keywordTypes } name={ cell.column.id } checkedId={ cell.getValue() } onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: ( cell ) => <SortMenu isFilter items={ keywordTypes } name={ cell.column.id } checkedId={ currentFilters.kwType || '' } onChange={ ( val ) => addFilter( 'kwType', val ) }>{ header.kwType }</SortMenu>,
			size: 100,
		} ),
		columnHelper.accessor( 'kw_length', {
			header: () => <RangeSlider isFilter min="0" max="255" onChange={ ( r ) => console.log( r ) }>{ header.kw_length }</RangeSlider>,
			size: 80,
		} ),
		columnHelper.accessor( 'kw_priority', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => <RangeSlider isFilter min="0" max="255" onChange={ ( r ) => console.log( r ) }>{ header.kw_priority }</RangeSlider>,
			size: 80,
		} ),
		columnHelper.accessor( 'lang', {
			className: 'nolimit',
			cell: ( cell ) => <LangMenu checkedId={ cell?.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) }
			/>,
			header: () => <LangMenu isFilter checkedId={ currentFilters.lang || 'all' } onChange={ ( val ) => addFilter( 'lang', val ) }>{ header.lang }</LangMenu>,
			size: 165,
		} ),
		columnHelper.accessor( 'kw_usage_count', {
			header: () => <RangeSlider isFilter min="0" max="255" onChange={ ( r ) => console.log( r ) }>{ header.kw_usage_count }</RangeSlider>,
			size: 70,
		} ),
		columnHelper.accessor( 'link_usage_count', {
			header: () => <RangeSlider isFilter min="0" max="255" onChange={ ( r ) => console.log( r ) }>{ header.link_usage_count }</RangeSlider>,
			size: 100,
		} ),
		columnHelper.accessor( 'urlFilter', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.renderValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => <MenuInput isFilter placeholder="Enter URL filter" defaultValue={ currentFilters.urlFilter } onChange={ ( val ) => addFilter( 'urlFilter', val ) }>{ header.urlFilter }</MenuInput>,
			size: 100,
		} ),
		columnHelper.accessor( 'urlLink', {
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: () => <MenuInput isFilter placeholder="Enter URL" onChange={ ( val ) => addFilter( 'urlLink', val ) }>{ header.urlLink }</MenuInput>,
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
				removeFilters={ ( array ) => removeFilters( array ) }
				exportOptions={ {
					url: slug,
					filters,
					fromId: 'from_kw_id',
					pageId: 'kw_id',
					deleteCSVCols: [ 'kw_id', 'dest_url_id' ],
				} }
			>
				<div className="ma-left flex flex-align-center">
					<strong>{ __( 'Sort by:' ) }</strong>
					<SortMenu className="ml-s" items={ header } name="sorting" onChange={ ( val ) => sortBy( val ) } />
				</div>
			</ModuleViewHeaderBottom>
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
