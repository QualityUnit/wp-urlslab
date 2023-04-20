import {
	useInfiniteFetch, ProgressBar, Tooltip, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat,
} from '../lib/tableImports';
import useTableUpdater from '../hooks/useTableUpdater';

export default function ContentCacheTable( { slug } ) {
	const primaryColumnNames = [ 'cache_crc32' ];
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );

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
	} = useInfiniteFetch( slug, primaryColumnNames, filters, sorting );

	const header = {
		date_changed: __( 'Last change' ),
		cache_len: __( 'Cache size' ),
		cache_content: __( 'Cache content' ),
	};

	const columns = [
		columnHelper.accessor( 'date_changed', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: header.date_changed,
			size: 100,
		} ),
		columnHelper.accessor( 'cache_len', {
			cell: ( cell ) => `${ Math.round( cell.getValue() / 1024, 0 ) }\u00A0kB`,
			header: header.cache_len,
			size: 100,
		} ),
		columnHelper.accessor( 'cache_content', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: header.cache_content,
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
