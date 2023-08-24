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
	const title = 'Add schedule';
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

	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const followLinksTypes = {
		FOLLOW_ALL_LINKS: __( 'Follow all links' ),
		FOLLOW_NO_LINK: __( 'Do not follow' ),
	};
	const analyzeTextTypes = {
		1: __( 'Analyze page text (Recommended)' ),
		0: __( 'Do not analyze text' ),
	};
	const processSitemapsTypes = {
		1: __( 'Process all sitemaps of domain (Recommended)' ),
		0: __( 'Schedule just single URL' ),
	};
	const takeScreenshotsTypes = {
		1: __( 'Screenshot every page of domain (Recommended)' ),
		0: __( 'Do not take screenshots' ),
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
		follow_links: __( 'Follow links' ),
		analyze_text: __( 'Analyse text' ),
		take_screenshot: __( 'Take screenshots' ),
		process_all_sitemaps: __( 'Process all sitemaps' ),
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
	}, [ data ] );

	const columns = [
		columnHelper?.accessor( 'urls', {
			className: 'nolimit',
			cell: ( array ) => array?.getValue().map( ( link ) => <><a href={ link } target="_blank" rel="noreferrer" key={ link }>{ link }</a>, </>,
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 300,
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
