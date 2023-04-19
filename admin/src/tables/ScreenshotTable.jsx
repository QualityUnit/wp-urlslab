import { useState } from 'react';
import {
	useInfiniteFetch, ProgressBar, Tooltip, Trash, LinkIcon, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function ScreenshotTable( { slug } ) {
	const pageId = 'url_id';

	const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater( { slug } );

	const url = `${ 'undefined' === typeof filters ? '' : filters }${ 'undefined' === typeof sortingColumn ? '' : sortingColumn }`;
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
	} = useInfiniteFetch( { key: slug, url, pageId } );

	const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows } = useChangeRow( { data, url, slug, pageId } );

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
			header: header.screenshot_url,
			size: 200,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: header.url_name,
			size: 200,
		} ),
		columnHelper.accessor( 'url_title', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip className="xxl">{ cell.getValue() }</Tooltip>,
			header: header.url_title,
			size: 200,
		} ),
		columnHelper?.accessor( 'scr_status', {
			filterValMenu: scrStatusTypes,
			cell: ( cell ) => scrStatusTypes[ cell.getValue() ],
			header: header.scr_status,
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
			header: header.screenshot_usage_count,
			size: 80,
		} ),
		columnHelper.accessor( 'update_scr_date', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: header.update_scr_date,
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
					url: slug,
					filters,
					fromId: `from_${ pageId }`,
					pageId,
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
				<TooltipSortingFiltering props={ { isFetching, filters, sortingColumn } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
