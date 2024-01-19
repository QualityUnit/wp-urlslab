import { memo, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch,
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

const title = __( 'Add Schedule' );
const paginationId = 'schedule_id';

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
	HOURLY: __( 'Hourly' ),
	DAILY: __( 'Daily' ),
	WEEKLY: __( 'Weekly' ),
	MONTHLY: __( 'Monthly (recommended)' ),
	YEARLY: __( 'Yearly' ),
	ONE_TIME: __( 'One Time' ),
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

export default function SchedulesTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow } = useChangeRow();

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
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

	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						data,
					},
				},
			}
		) );
	}, [ data, slug ] );

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ () => {
				selectRows( head, true );
			} } />,
		} ),
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
	], [ columnHelper, deleteRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The URLsLab plugin performs a variety of tasks, including taking screenshots, processing text, and generating summaries. These tasks are executed in the background on our servers and later synced with your WordPress database. This table displays scheduled tasks set to crawl specific domains or URLs at predetermined intervals. Each task performed by the URLsLab Service uses credits from your account. Therefore, it is essential to strategically select the scanning intervals for data from defined URLs and the types of tasks, so that credits are used efficiently.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noFiltering
				noCount
				hideActions
			/>
			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
			<TableEditorManager />
		</>
	);
}

const TableEditorManager = memo( () => {
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );

	const rowEditorCells = useMemo( () => ( {
		urls: <InputField liveUpdate description={ __( 'Add domain to schedule it in URLsLab. Be ready to boost your website with detailed reports' ) } defaultValue="" label={ header.urls } onChange={ ( val ) => setRowToEdit( { urls: val } ) } required />,
		analyze_text: <SingleSelectMenu description={ __( '' ) } defaultAccept autoClose items={ analyzeTextTypes } name="analyze_text" defaultValue="1" onChange={ ( val ) => setRowToEdit( { analyze_text: val } ) }>{ header.analyze_text }</SingleSelectMenu>,
		follow_links: <SingleSelectMenu description={ __( 'Helps to discover more pages by following all the links in your pages' ) } defaultAccept autoClose items={ followLinksTypes } name="follow_links" defaultValue={ 'FOLLOW_ALL_LINKS' } onChange={ ( val ) => setRowToEdit( { follow_links: val } ) }>{ header.follow_links }</SingleSelectMenu>,
		process_all_sitemaps: <SingleSelectMenu description={ __( '' ) } defaultAccept autoClose items={ processSitemapsTypes } name="process_all" defaultValue="1" onChange={ ( val ) => setRowToEdit( { process_all_sitemaps: val } ) }>{ header.process_all_sitemaps }</SingleSelectMenu>,
		take_screenshot: <SingleSelectMenu description={ __( '' ) } defaultAccept autoClose items={ takeScreenshotsTypes } name="take_screenshot" defaultValue="1" onChange={ ( val ) => setRowToEdit( { take_screenshot: val } ) }>{ header.take_screenshot }</SingleSelectMenu>,
		scan_frequency: <SingleSelectMenu description={ __( 'The frequency you want your domains to be crawled' ) } defaultAccept autoClose items={ scanFrequencyTypes } name="scan_frequency" defaultValue={ 'MONTHLY' } onChange={ ( val ) => setRowToEdit( { scan_frequency: val } ) }>{ header.scan_frequency }</SingleSelectMenu>,
		scan_speed_per_minute: <InputField description={ __( 'Choose this wisely to avoid crashing your website and hosting' ) } type="number" liveUpdate defaultValue="20" label={ header.scan_speed_per_minute } onChange={ ( val ) => setRowToEdit( { scan_speed_per_minute: val } ) } />,
	} ), [ setRowToEdit ] );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ paginationId ],
			}
		) );
	}, [ rowEditorCells ] );
} );
