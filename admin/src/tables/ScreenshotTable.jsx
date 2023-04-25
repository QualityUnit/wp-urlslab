import { useState } from 'react';
import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Trash, LinkIcon, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function ScreenshotTable( { slug } ) {
	const paginationId = 'url_id';

	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );

	const url = `${ 'undefined' === typeof filters ? '' : filters }${ 'undefined' === typeof sorting ? '' : sorting }`;
	const [ detailsOptions, setDetailsOptions ] = useState( null );

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

	const scrStatusTypes = {
		N: __( 'Waiting' ),
		A: __( 'Available' ),
		P: __( 'Pending' ),
		U: __( 'Updating' ),
		E: __( 'Disabled' ),
	};

	const header = {
		screenshot_url: __( 'Screenshot URL' ),
		url_name: __( 'Destination URL' ),
		url_title: __( 'Title' ),
		scr_status: __( 'Status' ),
		screenshot_usage_count: __( 'Usage' ),
		update_scr_date: __( 'Last change' ),
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
		columnHelper?.accessor( 'screenshot_url', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: <SortBy props={ { sorting, key: 'screenshot_url', onClick: () => sortBy( 'screenshot_url' ) } }>{ header.screenshot_url }</SortBy>,
			size: 200,
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
			header: <SortBy props={ { sorting, key: 'url_title', onClick: () => sortBy( 'url_title' ) } }>{ header.url_title }</SortBy>,
			size: 200,
		} ),
		columnHelper?.accessor( 'scr_status', {
			filterValMenu: scrStatusTypes,
			cell: ( cell ) => scrStatusTypes[ cell.getValue() ],
			header: <SortBy props={ { sorting, key: 'scr_status', onClick: () => sortBy( 'scr_status' ) } }>{ header.scr_status }</SortBy>,
			size: 80,
		} ),
		columnHelper?.accessor( 'screenshot_usage_count', {
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => setDetailsOptions( {
						title: `Screenshot used on these URLs`, slug, url: `${ cell.row.original.url_id }/linked-from`, showKeys: [ 'src_url_name' ], listId: 'src_url_id',
					} ) }>
						<LinkIcon />
						<Tooltip>{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: <SortBy props={ { sorting, key: 'screenshot_usage_count', onClick: () => sortBy( 'screenshot_usage_count' ) } }>{ header.screenshot_usage_count }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'update_scr_date', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: <SortBy props={ { sorting, key: 'update_scr_date', onClick: () => sortBy( 'update_scr_date' ) } }>{ header.update_scr_date }</SortBy>,
			size: 140,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			tooltip: () => <Tooltip className="align-left xxxl">{ __( 'Delete item' ) }</Tooltip>,
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
				detailsOptions={ detailsOptions }
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
