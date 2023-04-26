import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function CSSCacheTable( { slug } ) {
	const paginationId = 'url_id';
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const url = { filters, sorting };

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

	const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows } = useChangeRow( { data, url, slug, paginationId } );

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		D: __( 'Disabled' ),
	};

	const header = {
		url: __( 'URL' ),
		status: __( 'Status' ),
		status_changed: __( 'Last change' ),
		filesize: __( 'File size' ),
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
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th.id ) } }>{ header.url }</SortBy>,
			size: 450,
		} ),
		columnHelper?.accessor( 'status', {
			filterValMenu: statusTypes,
			cell: ( cell ) => statusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th.id ) } }>{ header.status }</SortBy>,
			size: 80,
		} ),
		columnHelper?.accessor( 'status_changed', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th.id ) } }>{ header.status_changed }</SortBy>,
			size: 100,
		} ),
		columnHelper?.accessor( 'filesize', {
			unit: 'kB',
			cell: ( cell ) => `${ Math.round( cell.getValue() / 1024, 0 ) }\u00A0kB`,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th.id ) } }>{ header.filesize }</SortBy>,
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
				selectedRows={ selectedRows }
				onDeleteSelected={ deleteSelectedRows }
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
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
