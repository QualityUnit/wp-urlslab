import {
	useInfiniteFetch, ProgressBar, Tooltip, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function CSSCacheTable( { slug } ) {
	const pageId = 'url_id';
	const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater( { slug } );
	const url = `${ filters || '' }${ sortingColumn || '' }`;

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
	} = useInfiniteFetch( { key: slug, url, pageId } );

	const { row, selectRow, deleteRow } = useChangeRow( { data, url, slug, pageId } );

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		D: __( 'Disabled' ),
	};

	const header = {
		url: __( 'URL' ),
		status: __( 'Status' ),
		status_changed: __( 'Status changed' ),
		filesize: __( 'Filesize' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper?.accessor( 'url', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: header.url,
			size: 450,
		} ),
		columnHelper?.accessor( 'status', {
			filterValMenu: statusTypes,
			cell: ( cell ) => statusTypes[ cell.getValue() ],
			header: header.status,
			size: 80,
		} ),
		columnHelper?.accessor( 'status_changed', {
			cell: ( val ) => new Date( val?.getValue() ).toLocaleString( window.navigator.language ),
			header: header.status_changed,
			size: 100,
		} ),
		columnHelper?.accessor( 'filesize', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			unit: 'kB',
			cell: ( cell ) => `${ Math.round( cell.getValue() / 1024, 0 ) }\u00A0kB`,
			header: header.filesize,
			size: 100,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { cell } ) } />,
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
				header={ header }
				table={ table }
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
				{ row
					? <Tooltip center>{ `${ header.url_name } “${ row.url_name }”` } { __( 'has been deleted.' ) }</Tooltip>
					: null
				}
				<TooltipSortingFiltering props={ { isFetching, filters, sortingColumn } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
