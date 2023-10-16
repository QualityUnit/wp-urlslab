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
import DescriptionBox from '../elements/DescriptionBox';
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
		1: __( 'Capture a screenshot of each page (recommended)' ),
		0: __( 'Disable screenshot capture' ),
	};

	const scanFrequencyTypes = {
		HOURLY: 'Hourly',
		DAILY: 'Daily',
		WEEKLY: 'Weekly',
		MONTHLY: 'Monthly (recommended)',
		YEARLY: 'Yearly',
		ONE_TIME: 'One Time',
	};

	const header = {
		urls: __( 'Domain/URL' ),
		scan_frequency: __( 'Scan frequency' ),
		scan_speed_per_minute: __( 'Scan speed (pages per minute)' ),
		follow_links: __( 'Process found links' ),
		analyze_text: __( 'Analyze text' ),
		take_screenshot: __( 'Screenshots' ),
		process_all_sitemaps: __( 'Domain sitemaps' ),
		custom_sitemaps: __( 'Sitemap URLs' ),
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

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId ],
			}
		) );
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						title,
						paginationId,
						optionalSelector: undefined,
						slug,
						header,
						id: 'urls',
					},
				},
			}
		) );
	}, [ slug ] );

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: { ...useTableStore.getState().tables, [ slug ]: { ...useTableStore.getState().tables[ slug ], data } },
			}
		) );
	}, [ data, slug ] );

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
			size: 120,
		} ),
		columnHelper.accessor( 'scan_speed_per_minute', {
			header: ( th ) => <SortBy { ...th } />,
			size: 90,
		} ),
		columnHelper?.accessor( 'follow_links', {
			filterValMenu: followLinksTypes,
			cell: ( cell ) => <Checkbox disabled className="readOnly" defaultValue={ cell.getValue() === 'FOLLOW_ALL_LINKS' } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 90,
		} ),
		columnHelper?.accessor( 'analyze_text', {
			cell: ( cell ) => <Checkbox disabled className="readOnly" defaultValue={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 90,
		} ),
		columnHelper?.accessor( 'take_screenshot', {
			cell: ( cell ) => <Checkbox disabled className="readOnly" defaultValue={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 90,
		} ),
		columnHelper?.accessor( 'process_all_sitemaps', {
			cell: ( cell ) => <Checkbox disabled className="readOnly" defaultValue={ cell.getValue() } />,
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
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'Learn more…' ) } isMainTableDescription>
				{ __( 'The URLsLab plugin performs a variety of tasks such as taking screenshots, processing text, and generating URL summaries. These tasks are performed in the background on our servers and later synced with your Wordpress database. This table displays scheduled tasks set to crawl specific domains or URLs at predetermined intervals. Each task performed by the URLsLab service uses credits from your account. Therefore, it is essential to strategically select the interval for scanning data from defined URLs and the type of tasks so that credits are utilized efficiently.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noFiltering
				noCount
				noExport
				noImport
				noDelete
			/>
			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referer={ ref }
			>
				<TooltipSortingFiltering />
				<>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</>
			</Table>
		</>
	);
}
