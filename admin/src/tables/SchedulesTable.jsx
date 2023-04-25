import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Trash, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function SchedulesTable( { slug } ) {
	const paginationId = 'schedule_id';
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

	const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows } = useChangeRow( { data, url, slug, paginationId } );

	const followLinksTypes = {
		FOLLOW_ALL_LINKS: __( 'Follow all links' ),
		FOLLOW_NO_LINK: __( 'Do not follow' ),
	};

	const scanFrequencyTypes = {
		ONE_TIME: 'One Time',
		YEARLY: 'Yearly',
		MONTHLY: 'Monthly',
		DAILY: 'Daily',
		WEEKLY: 'Weekly',
		HOURLY: 'Hourly',
	};

	const header = {
		urls: __( 'URLs' ),
		analyze_text: __( 'Analyze text' ),
		follow_links: __( 'Follow links' ),
		process_all_sitemaps: __( 'Process all sitemaps' ),
		take_screenshot: __( 'Take screenshot' ),
		custom_sitemaps: __( 'Sitemaps' ),
		scan_frequency: __( 'Scan frequency' ),
		scan_speed_per_minute: __( 'Scan speed per min.' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper?.accessor( 'urls', {
			className: 'nolimit',
			cell: ( array ) => array?.getValue().map( ( link ) => <><a href={ link } target="_blank" rel="noreferrer" key={ link }>{ link }</a>, </>,
			),
			header: <SortBy props={ { header, sorting, key: 'urls', onClick: () => sortBy( 'urls' ) } }>{ header.urls }</SortBy>,
			size: 300,
		} ),
		columnHelper?.accessor( 'analyze_text', {
			cell: ( cell ) => <Checkbox readOnly className="readOnly" checked={ cell.getValue() } />,
			header: <SortBy props={ { header, sorting, key: 'analyze_text', onClick: () => sortBy( 'analyze_text' ) } }>{ header.analyze_text }</SortBy>,
			size: 100,
		} ),
		columnHelper?.accessor( 'follow_links', {
			filterValMenu: followLinksTypes,
			cell: ( cell ) => followLinksTypes[ cell?.getValue() ],
			header: <SortBy props={ { header, sorting, key: 'follow_links', onClick: () => sortBy( 'follow_links' ) } }>{ header.follow_links }</SortBy>,
			size: 150,
		} ),
		columnHelper?.accessor( 'process_all_sitemaps', {
			cell: ( cell ) => <Checkbox readOnly className="readOnly" checked={ cell.getValue() } />,
			header: <SortBy props={ { header, sorting, key: 'process_all_sitemaps', onClick: () => sortBy( 'process_all_sitemaps' ) } }>{ header.process_all_sitemaps }</SortBy>,
			size: 150,
		} ),
		columnHelper.accessor( 'scan_frequency', {
			filterValMenu: scanFrequencyTypes,
			cell: ( cell ) => scanFrequencyTypes[ cell?.getValue() ],
			header: <SortBy props={ { header, sorting, key: 'scan_frequency', onClick: () => sortBy( 'scan_frequency' ) } }>{ header.scan_frequency }</SortBy>,
			size: 90,
		} ),
		columnHelper.accessor( 'scan_speed_per_minute', {
			header: <SortBy props={ { header, sorting, key: 'scan_speed_per_minute', onClick: () => sortBy( 'scan_speed_per_minute' ) } }>{ header.scan_speed_per_minute }</SortBy>,
			size: 120,
		} ),
		columnHelper?.accessor( 'take_screenshot', {
			cell: ( cell ) => <Checkbox readOnly className="readOnly" checked={ cell.getValue() } />,
			header: <SortBy props={ { header, sorting, key: 'take_screenshot', onClick: () => sortBy( 'take_screenshot' ) } }>{ header.take_screenshot }</SortBy>,
			size: 90,
		} ),
		columnHelper?.accessor( 'custom_sitemaps', {
			className: 'nolimit',
			cell: ( array ) => array?.getValue().map( ( sitemap ) => <><a href={ sitemap } target="_blank" rel="noreferrer" key={ sitemap }>{ sitemap }</a>, </>,
			),
			header: <SortBy props={ { header, sorting, key: 'custom_sitemaps', onClick: () => sortBy( 'custom_sitemaps' ) } }>{ header.custom_sitemaps }</SortBy>,
			size: 300,
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
				noCount
				noExport
				noDelete
				selectedRows={ selectedRows }
				onSort={ ( val ) => sortBy( val ) }
				onDeleteSelected={ deleteSelectedRows }
				onFilter={ ( filter ) => setFilters( filter ) }
			/>
			<Table className="noHeightLimit fadeInto"
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
