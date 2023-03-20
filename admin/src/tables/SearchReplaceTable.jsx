import { useMemo } from 'react';
import {
	useInfiniteFetch, handleSelected, Tooltip, SortMenu, InputField, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function SearchReplaceTable( { slug } ) {
	const { table, setTable, filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, rowToInsert, setInsertRow, deleteRow, updateRow } = useTableUpdater( { slug } );

	const url = useMemo( () => `${ filters }${ sortingColumn }`, [ filters, sortingColumn ] );
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
	} = useInfiniteFetch( { key: slug, url, pageId, currentFilters, sortingColumn } );

	const searchTypes = {
		T: __( 'Plain Text' ),
		R: __( 'Regular Expr.' ),
	};

	const header = {
		str_search: __( 'Search string' ),
		str_replace: __( 'Replace string' ),
		search_type: __( 'Search Type' ),
		url_filter: 'URL Filter',
	};

	const inserterCells = {
		str_search: <InputField type="url" defaultValue="" onChange={ ( val ) => setInsertRow( { ...rowToInsert, str_search: val } ) } />,
		str_replace: <InputField type="url" defaultValue="" onChange={ ( val ) => setInsertRow( { ...rowToInsert, str_replace: val } ) } />,
		search_type: <SortMenu items={ searchTypes } name="search_type" checkedId="T" onChange={ ( val ) => setInsertRow( { ...rowToInsert, search_type: val } ) } />,
		url_filter: <InputField defaultValue=".*" onChange={ ( val ) => setInsertRow( { ...rowToInsert, url_filter: val } ) } />,
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
			header: header.str_search,
			size: 300,
		} ),
		columnHelper.accessor( 'str_replace', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: header.str_replace,
			size: 300,
		} ),
		columnHelper.accessor( 'search_type', {
			className: 'nolimit',
			cell: ( cell ) => <SortMenu items={ searchTypes } name={ cell.column.id } checkedId={ cell.getValue() } onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: header.search_type,
			size: 100,
		} ),
		columnHelper.accessor( 'url_filter', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: header.url_filter,
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
				table={ table }
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
			<Table className="fadeInto" slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				inserter={ { inserterCells, data, slug, url, rowToInsert } }
			>
				{ row
					? <Tooltip center>{ `${ header.str_search } “${ row.str_search }”` } { __( 'has been deleted.' ) }</Tooltip>
					: null
				}
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
