import { useMemo } from 'react';
import {
	useInfiniteFetch, handleSelected, Tooltip, Trash, Checkbox, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function SchedulesTable( { slug } ) {
	const { table, setTable, filters, setFilters, currentFilters, sortingColumn, sortBy, row, deleteRow } = useTableUpdater( { slug } );

	const url = useMemo( () => `${ filters }${ sortingColumn }`, [ filters, sortingColumn ] );
	const pageId = 'schedule_id';

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, url, pageId, currentFilters, sortingColumn } );

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
				handleSelected( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper?.accessor( 'urls', {
			className: 'nolimit',
			cell: ( array ) => array?.getValue().map( ( link ) => <><a href={ link } target="_blank" rel="noreferrer" key={ link }>{ link }</a>, </>,
			),
			header: header.urls,
			size: 300,
		} ),
		columnHelper?.accessor( 'analyze_text', {
			cell: ( cell ) => <Checkbox readOnly className="readOnly" checked={ cell.getValue() } />,
			header: header.analyze_text,
			size: 100,
		} ),
		columnHelper?.accessor( 'follow_links', {
			cell: ( cell ) => followLinksTypes[ cell?.getValue() ],
			header: header.follow_links,
			size: 150,
		} ),
		columnHelper?.accessor( 'process_all_sitemaps', {
			cell: ( cell ) => <Checkbox readOnly className="readOnly" checked={ cell.getValue() } />,
			header: header.process_all_sitemaps,
			size: 150,
		} ),
		columnHelper.accessor( 'scan_frequency', {
			cell: ( cell ) => scanFrequencyTypes[ cell?.getValue() ],
			header: header.scan_frequency,
			size: 90,
		} ),
		columnHelper.accessor( 'scan_speed_per_minute', {
			header: header.scan_speed_per_minute,
			size: 120,
		} ),
		columnHelper?.accessor( 'take_screenshot', {
			cell: ( cell ) => <Checkbox readOnly className="readOnly" checked={ cell.getValue() } />,
			header: header.take_screenshot,
			size: 90,
		} ),
		columnHelper?.accessor( 'custom_sitemaps', {
			className: 'nolimit',
			cell: ( array ) => array?.getValue().map( ( sitemap ) => <><a href={ sitemap } target="_blank" rel="noreferrer" key={ sitemap }>{ sitemap }</a>, </>,
			),
			header: header.custom_sitemaps,
			size: 300,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { data, url, slug, cell, rowSelector: pageId } ) } />,
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
				// defaultSortBy="url_name&ASC"
				onSort={ ( val ) => sortBy( val ) }
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
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
