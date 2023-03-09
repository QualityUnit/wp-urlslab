
import {
	useInfiniteFetch, handleSelected, Tooltip, SortMenu, InputField, Checkbox, MenuInput, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function SearchReplaceTable( { slug } ) {
	const { setHiddenTable, filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater();

	const url = `${ filters }${ sortingColumn }`;
	const pageId = 'id';

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

	const searchTypes = {
		T: __( 'Plain Text' ),
		R: __( 'Regular Expr.' ),
	};

	const header = {
		id: '',
		str_search: __( 'Search string' ),
		str_replace: __( 'Replace string' ),
		search_type: __( 'Search Type' ),
		url_filter: 'URL Filter',
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'str_search', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => <MenuInput placeholder="Enter search string" onChange={ ( val ) => addFilter( 'str_search', val ) }>{ header.str_search }</MenuInput>,
			size: 300,
		} ),
		columnHelper.accessor( 'str_replace', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => <MenuInput isFilter placeholder="Enter replace string" onChange={ ( val ) => addFilter( 'str_replace', val ) }>{ header.str_replace }</MenuInput>,
			size: 300,
		} ),
		columnHelper.accessor( 'search_type', {
			className: 'nolimit',
			cell: ( cell ) => <SortMenu items={ searchTypes } name={ cell.column.id } checkedId={ cell.getValue() } onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: ( cell ) => <SortMenu isFilter items={ searchTypes } name={ cell.column.id } checkedId={ header.search_type } onChange={ ( val ) => addFilter( 'search_type', val ) }>{ header.search_type }</SortMenu>,
			size: 100,
		} ),
		columnHelper.accessor( 'urlFilter', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => <MenuInput isFilter placeholder="Enter filter" onChange={ ( val ) => addFilter( 'urlFilter', val ) }>{ header.url_filter }</MenuInput>,
			size: 100,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { data, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => null,
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
					fromId: `from_${ pageId }`,
					pageId,
					deleteCSVCols: [ 'id', 'destUrlMd5' ],
				} }
				hideTable={ ( hidden ) => setHiddenTable( hidden ) }
			>
				<div className="ma-left flex flex-align-center">
					<strong>Sort by:</strong>
					<SortMenu className="ml-s" items={ header } name="sorting" onChange={ ( val ) => sortBy( val ) } />
				</div>
			</ModuleViewHeaderBottom>
			<Table className="fadeInto" slug={ slug } columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }>
				{ row
					? <Tooltip center>{ `${ header.str_search } “${ row.str_search }”` } { __( 'has been deleted.' ) }</Tooltip>
					: null
				}
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
