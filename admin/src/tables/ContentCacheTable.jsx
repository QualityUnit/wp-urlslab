import {
	useInfiniteFetch, handleInput, handleSelected, RangeSlider, SortMenu, LangMenu, InputField, Checkbox, MenuInput, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function ContentCacheTable() {
	const { tableHidden, setHiddenTable, filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, deleteRow, updateRow } = useTableUpdater();

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: 'content-cache', url: `${ filters }${ sortingColumn }`, pageId: 'cache_crc32' } );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
		} ),
		columnHelper.accessor( 'date_changed', {
			header: () => __( 'Changed at' ),
		} ),
		columnHelper.accessor( 'cache_len', {
			header: () => __( 'Cache size' ),
		} ),
		columnHelper.accessor( 'cache_content', {
			header: () => __( 'Cache content' ),
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<Table className="fadeInto" columns={ columns }
			data={
				isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
			}
		>
			<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
		</Table>
	);
}
