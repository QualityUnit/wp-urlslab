import { useMemo } from 'react';
import {
	useInfiniteFetch, Tooltip, Loader, Table, ModuleViewHeaderBottom,
} from '../lib/tableImports';
import useTableUpdater from '../hooks/useTableUpdater';

export default function ContentCacheTable( { slug } ) {
	const pageId = 'cache_crc32';
	const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater( { slug } );
	const url = useMemo( () => `${ filters }${ sortingColumn }`, [ filters, sortingColumn ] );

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

	const header = {
		date_changed: __( 'Changed at' ),
		cache_len: __( 'Cache size' ),
		cache_content: __( 'Cache content' ),
	};

	const columns = [
		columnHelper.accessor( 'date_changed', {
			cell: ( val ) => new Date( val?.getValue() ).toLocaleString( window.navigator.language ),
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
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
