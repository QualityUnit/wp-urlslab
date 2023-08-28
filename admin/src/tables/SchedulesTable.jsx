import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';

import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	InputField, SingleSelectMenu, RowActionButtons,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';

import '../assets/styles/components/_ModuleViewHeader.scss';

export default function SchedulesTable( { slug } ) {
	const { __ } = useI18n();
	const title = 'Add Schedule';
	const paginationId = 'schedule_id';

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { deleteRow } = useChangeRow();

	const { resetTableStore } = useTableStore();
	const { resetPanelsStore } = useTablePanels();
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const followLinksTypes = {
		FOLLOW_ALL_LINKS: __( 'Process all links (recommended)' ),
		FOLLOW_NO_LINK: __( 'Don\'t process found links' ),
	};
	const analyzeTextTypes = {
		1: __( 'Analyze page texts (recommended)' ),
		0: __( 'Don\'t analyze page texts' ),
	};
	const processSitemapsTypes = {
		1: __( 'Process all domain sitemaps (recommended)' ),
		0: __( 'Schedule a single URL only' ),
	};
	const takeScreenshotsTypes = {
		1: __( 'Capture a screenshot of each domain page (recommended)' ),
		0: __( 'Disable screenshot capture' ),
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
		follow_links: __( 'Process found links' ),
		analyze_text: __( 'Analyze text' ),
		take_screenshot: __( 'Screenshots' ),
		process_all_sitemaps: __( 'Domain sitemaps' ),
		custom_sitemaps: __( 'Sitemaps' ),
		scan_frequency: __( 'Scan frequency' ),
		scan_speed_per_minute: __( 'Scan speed (pages per minute)' ),
	};
	const rowEditorCells = {
		urls: <InputField liveUpdate defaultValue="" label={ header.urls } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, urls: val } ) } required />,
		analyze_text: <SingleSelectMenu defaultAccept autoClose items={ analyzeTextTypes } name="analyze_text" defaultValue="1" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, analyze_text: val } ) }>{ header.analyze_text }</SingleSelectMenu>,
		follow_links: <SingleSelectMenu defaultAccept autoClose items={ followLinksTypes } name="follow_links" defaultValue={ 'FOLLOW_ALL_LINKS' } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, follow_links: val } ) }>{ header.follow_links }</SingleSelectMenu>,
		process_all_sitemaps: <SingleSelectMenu defaultAccept autoClose items={ processSitemapsTypes } name="process_all" defaultValue="1" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, process_all_sitemaps: val } ) }>{ header.process_all_sitemaps }</SingleSelectMenu>,
		custom_sitemaps: <InputField liveUpdate defaultValue="" label={ header.custom_sitemaps } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, custom_sitemaps: val } ) } />,
		take_screenshot: <SingleSelectMenu defaultAccept autoClose items={ takeScreenshotsTypes } name="take_screenshot" defaultValue="1" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, take_screenshot: val } ) }>{ header.take_screenshot }</SingleSelectMenu>,
		scan_frequency: <SingleSelectMenu defaultAccept autoClose items={ scanFrequencyTypes } name="scan_frequency" defaultValue={ 'MONTHLY' } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, scan_frequency: val } ) }>{ header.scan_frequency }</SingleSelectMenu>,
		scan_speed_per_minute: <InputField liveUpdate defaultValue="20" label={ header.scan_speed_per_minute } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, scan_speed_per_minute: val } ) } />,
	};

	// Saving all variables into state managers
	useEffect( () => {
		resetPanelsStore();
		resetTableStore();

		useTableStore.setState( () => (
			{
				data,
				title,
				paginationId,
				optionalSelector: undefined,
				slug,
				header,
				id: 'urls',
			}
		) );

		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId ],
			}
		) );
	}, [ ] );

	const columns = [
		columnHelper?.accessor( 'urls', {
			className: 'nolimit',
			cell: ( array ) => array?.getValue().map( ( link ) => <><strong>{ link }</strong> </>,
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 300,
		} ),
		columnHelper.accessor( 'scan_frequency', {
			filterValMenu: scanFrequencyTypes,
			cell: ( cell ) => scanFrequencyTypes[ cell?.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 90,
		} ),
		columnHelper.accessor( 'scan_speed_per_minute', {
			header: ( th ) => <SortBy { ...th } />,
			size: 90,
		} ),
		columnHelper?.accessor( 'follow_links', {
			filterValMenu: followLinksTypes,
			cell: ( cell ) => followLinksTypes[ cell?.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper?.accessor( 'analyze_text', {
			cell: ( cell ) => <Checkbox readOnly className="readOnly" defaultValue={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 90,
		} ),
		columnHelper?.accessor( 'take_screenshot', {
			cell: ( cell ) => <Checkbox readOnly className="readOnly" defaultValue={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 90,
		} ),
		columnHelper?.accessor( 'process_all_sitemaps', {
			cell: ( cell ) => <Checkbox readOnly className="readOnly" defaultValue={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 90,
		} ),
		columnHelper?.accessor( 'custom_sitemaps', {
			cell: ( array ) => array?.getValue().map( ( sitemap ) => <><a href={ sitemap } target="_blank" rel="noreferrer" key={ sitemap }>{ sitemap }</a>, </>,
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell, id: 'urls' } ) }
			>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				noFiltering
				noCount
				noExport
				noImport
				noDelete
			/>
			<Table className="noHeightLimit fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				<TooltipSortingFiltering />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
