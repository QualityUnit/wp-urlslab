
import {
	useInfiniteFetch, handleInput, handleSelected, SortMenu, InputField, Checkbox, MenuInput, Button, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function SearchReplaceTable( { slug } ) {
	const { tableHidden, setHiddenTable, filters, currentFilters, addFilter, removeFilter, sortingColumn, sortBy, deleteRow, updateRow } = useTableUpdater();
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
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			cell: ( cell ) => <Button danger onClick={ () => deleteRow( { data, url, slug, cell, rowSelector: pageId } ) }><Trash /></Button>,
			header: () => __( '' ),
			enableResizing: false,
			maxSize: 0,
			size: 0,
		} ),
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
			enableResizing: false,
			maxSize: 24,
			size: 24,
		} ),
		columnHelper.accessor( 'str_search', {
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( val ) => handleInput( val, cell ) } />,
			header: () => <MenuInput placeholder="Enter search string" onChange={ ( val ) => addFilter( 'str_search', val ) }>{ header.str_search }</MenuInput>,
			size: 100,
		} ),
		columnHelper.accessor( 'str_replace', {
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( val ) => handleInput( val, cell ) } />,
			header: () => <MenuInput placeholder="Enter replace string" onChange={ ( val ) => addFilter( 'str_replace', val ) }>{ header.str_replace }</MenuInput>,
			size: 100,
		} ),
		columnHelper.accessor( 'search_type', {
			cell: ( cell ) => <SortMenu items={ searchTypes } name={ cell.column.id } checkedId={ cell.getValue() } onChange={ ( val ) => handleInput( val, cell ) } />,
			header: ( cell ) => <SortMenu items={ searchTypes } name={ cell.column.id } checkedId={ header.search_type } onChange={ ( val ) => addFilter( 'search_type', val ) } />,
		} ),
		columnHelper.accessor( 'urlFilter', {
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( val ) => handleInput( val, cell ) } />,
			header: () => header.url_filter,
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
				removedFilter={ ( key ) => removeFilter( key ) }
				exportOptions={ {
					url: slug,
					filters,
					fromId: 'from_id',
					pageId: 'id',
					deleteCSVCols: [ 'id', 'destUrlMd5' ],
				} }
				hideTable={ ( hidden ) => setHiddenTable( hidden ) }
			>
				<div className="ma-left flex flex-align-center">
					<strong>Sort by:</strong>
					<SortMenu className="ml-s" items={ header } name="sorting" onChange={ ( val ) => sortBy( val ) } />
				</div>
			</ModuleViewHeaderBottom>
			{ tableHidden
				? null
				: <Table className="fadeInto"
					// resizable
					slug={ slug }
					columns={ columns }
					data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }>
					<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
				</Table>
			}
		</>
	);
}
