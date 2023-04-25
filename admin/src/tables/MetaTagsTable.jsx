import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Trash, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, InputField, DateTimeFormat,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function LinkManagerTable( { slug } ) {
	const paginationId = 'url_id';
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

	const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	// const sumStatusTypes = {
	// 	N: __( 'Waiting' ),
	// 	A: __( 'Processed' ),
	// 	P: __( 'Pending' ),
	// 	U: __( 'Updating' ),
	// 	E: __( 'Error' ),
	// };

	const httpStatusTypes = {
		'-2': __( 'Processing' ),
		'-1': __( 'Waiting' ),
		200: __( 'Valid' ),
		400: __( 'Client Error' ),
		404: __( 'Not Found' ),
		500: __( 'Server Error' ),
		503: __( 'Server Error' ),
	};

	const relScheduleTypes = {
		N: 'New',
		M: 'Manual',
		S: 'Scheduled',
		E: 'Error',
	};

	const header = {
		url_name: __( 'URL' ),
		url_title: __( 'Title' ),
		url_meta_description: __( 'Description' ),
		url_summary: __( 'Summary' ),
		http_status: __( 'Status' ),
		rel_schedule: __( 'Schedule' ),
		update_http_date: __( 'Last change' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper?.accessor( 'screenshot_url', {
			className: 'thumbnail',
			cell: ( image ) => image?.getValue()
				? <a href={ image?.getValue() } target="_blank" rel="noreferrer"><img src={ image?.getValue() } alt={ image.row.original.url_name } /></a>
				: <div className="img"></div>,
			header: __( 'Thumbnail' ),
			size: 80,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: <SortBy props={ { sorting, key: 'url_name', onClick: () => sortBy( 'url_name' ) } }>{ header.url_name }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'url_title', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip className="xxl">{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'url_title', onClick: () => sortBy( 'url_title' ) } }>{ header.url_title }</SortBy>,
			size: 200,
		} ),
		columnHelper?.accessor( 'url_meta_description', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip className="xxl">{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'url_meta_description', onClick: () => sortBy( 'url_meta_description' ) } }>{ header.url_meta_description }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'url_summary', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip className="xxl">{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'url_summary', onClick: () => sortBy( 'url_summary' ) } }>{ header.url_summary }</SortBy>,
			size: 150,
		} ),
		columnHelper?.accessor( 'http_status', {
			filterValMenu: httpStatusTypes,
			cell: ( cell ) => httpStatusTypes[ cell.getValue() ],
			header: <SortBy props={ { sorting, key: 'http_status', onClick: () => sortBy( 'http_status' ) } }>{ header.http_status }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'rel_schedule', {
			filterValMenu: relScheduleTypes,
			cell: ( cell ) => relScheduleTypes[ cell.getValue() ],
			header: <SortBy props={ { sorting, key: 'rel_schedule', onClick: () => sortBy( 'rel_schedule' ) } }>{ header.rel_schedule }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'update_http_date', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: <SortBy props={ { sorting, key: 'update_http_date', onClick: () => sortBy( 'update_http_date' ) } }>{ header.update_http_date }</SortBy>,
			size: 140,
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
				selectedRows={ selectedRows }
				onSort={ ( val ) => sortBy( val ) }
				onDeleteSelected={ deleteSelectedRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				noImport
				exportOptions={ {
					slug,
					filters,
					fromId: `from_${ paginationId }`,
					paginationId,
					deleteCSVCols: [ 'urlslab_url_id', 'url_id', 'urlslab_domain_id' ],
					perPage: 1000,
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				{ row
					? <Tooltip center>{ `${ header.url_name } “${ row.url_name }”` } has been deleted.</Tooltip>
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
