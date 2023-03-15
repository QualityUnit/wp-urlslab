import { useMemo } from 'react';
import {
	useInfiniteFetch, handleSelected, Tooltip, Trash, InputField, MenuInput, SortMenu, Checkbox, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function SchedulesTable( { slug } ) {
	const { filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater( { slug } );

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

	// const booleanTypes = {
	// 	true: __( 'True' ),
	// 	false: __( 'Processed' ),
	// 	P: __( 'Pending' ),
	// 	U: __( 'Updating' ),
	// 	E: __( 'Error' ),
	// };

	const header = {
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
		columnHelper?.accessor( 'analyze_text', {
			header: header.analyze_text,
			size: 100,
		} ),
		columnHelper?.accessor( 'follow_links', {
			cell: ( cell ) => cell?.getValue(),
			header: header.follow_links,
			size: 150,
		} ),
		columnHelper?.accessor( 'process_all_sitemaps', {
			header: header.process_all_sitemaps,
			size: 150,
		} ),
		columnHelper.accessor( 'scan_frequency', {
			header: header.scan_frequency,
			size: 90,
		} ),
		columnHelper.accessor( 'scan_speed_per_minute', {
			header: header.scan_speed_per_minute,
			size: 90,
		} ),
		columnHelper?.accessor( 'take_screenshot', {
			header: header.take_screenshot,
			size: 90,
		} ),
		columnHelper?.accessor( 'custom_sitemaps', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( array ) => array?.getValue().map( ( sitemap ) =>
				<a href={ sitemap } target="_blank" rel="noreferrer" key={ sitemap }>{ sitemap }</a>,
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
				currentFilters={ currentFilters }
				header={ header }
				noCount
				// removeFilters={ ( key ) => removeFilters( key ) }
				// defaultSortBy="url_name&ASC"
				onSort={ ( val ) => sortBy( val ) }
				// exportOptions={ {
				// 	url: slug,
				// 	filters,
				// 	fromId: `from_${ pageId }`,
				// 	pageId,
				// 	deleteCSVCols: [ 'urlslab_url_id', 'url_id', 'urlslab_domain_id' ],
				// 	perPage: 1000,
				// } }
			/>
			<Table className="fadeInto" columns={ columns }
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
