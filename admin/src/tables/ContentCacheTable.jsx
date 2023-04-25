import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat,
} from '../lib/tableImports';
import useTableUpdater from '../hooks/useTableUpdater';

export default function ContentCacheTable( { slug } ) {
	const paginationId = 'cache_crc32';
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const url = `${ 'undefined' === typeof filters ? '' : filters }${ 'undefined' === typeof sorting ? '' : sorting }`;

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, filters, sorting, paginationId } );

	const header = {
		date_changed: __( 'Last change' ),
		cache_len: __( 'Cache size' ),
		cache_content: __( 'Cache content' ),
	};

	const columns = [
		columnHelper.accessor( 'date_changed', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: <SortBy props={ { sorting, key: 'date_changed', onClick: () => sortBy( 'date_changed' ) } }>{ header.date_changed }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'cache_len', {
			cell: ( cell ) => `${ Math.round( cell.getValue() / 1024, 0 ) }\u00A0kB`,
			header: <SortBy props={ { sorting, key: 'cache_len', onClick: () => sortBy( 'cache_len' ) } }>{ header.cache_len }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'cache_content', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: <SortBy props={ { sorting, key: 'cache_content', onClick: () => sortBy( 'cache_content' ) } }>{ header.cache_content }</SortBy>,
			size: 500,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				slug={ slug }
				header={ header }
				table={ table }
				noDelete
				noExport
				noImport
				onSort={ ( val ) => sortBy( val ) }
				onFilter={ ( filter ) => setFilters( filter ) }
			/>
			<Table className="fadeInto" columns={ columns }
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				data={
					isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
				}
			>
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
