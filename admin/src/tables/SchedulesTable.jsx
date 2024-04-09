import { memo, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch,
	SortBy,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	InputField, SingleSelectMenu, RowActionButtons, TableSelectCheckbox,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';
import '../assets/styles/components/_ModuleViewHeader.scss';

const title = __( 'Add Schedule', 'urlslab' );
const paginationId = 'schedule_id';
const followLinksTypes = {
	FOLLOW_ALL_LINKS: __( 'Process all links (recommended)', 'urlslab' ),
	FOLLOW_NO_LINK: __( 'Don\'t process found links', 'urlslab' ),
};
const analyzeTextTypes = {
	1: __( 'Analyze page texts (recommended)', 'urlslab' ),
	0: __( 'Don\'t analyze page texts', 'urlslab' ),
};
const processSitemapsTypes = {
	1: __( 'Process all domain sitemaps (recommended)', 'urlslab' ),
	0: __( 'Schedule a single URL only', 'urlslab' ),
};
const takeScreenshotsTypes = {
	1: __( 'Capture a screenshot of each page (recommended)', 'urlslab' ),
	0: __( 'Disable screenshot capture', 'urlslab' ),
};
const scanFrequencyTypes = {
	HOURLY: __( 'Hourly', 'urlslab' ),
	DAILY: __( 'Daily', 'urlslab' ),
	WEEKLY: __( 'Weekly', 'urlslab' ),
	MONTHLY: __( 'Monthly (recommended)', 'urlslab' ),
	YEARLY: __( 'Yearly', 'urlslab' ),
	ONE_TIME: __( 'One Time', 'urlslab' ),
};
const header = {
	urls: __( 'Domain/URL', 'urlslab' ),
	scan_frequency: __( 'Scan frequency', 'urlslab' ),
	scan_speed_per_minute: __( 'Scan speed (pages per minute)', 'urlslab' ),
	follow_links: __( 'Process found links', 'urlslab' ),
	analyze_text: __( 'Analyze text', 'urlslab' ),
	take_screenshot: __( 'Screenshots', 'urlslab' ),
	process_all_sitemaps: __( 'Domain sitemaps', 'urlslab' ),
	custom_sitemaps: __( 'Sitemap URLs', 'urlslab' ),
};

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			title,
			paginationId,
			optionalSelector: undefined,
			slug,
			header,
			id: 'urls',
		} );
	}, [ setTable, slug ] );

	return init && <SchedulesTable slug={ slug } />;
}

function SchedulesTable( { slug } ) {
	const {
		columnHelper,
		data,
		isLoading,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const setTable = useTableStore( ( state ) => state.setTable );

	const { deleteRow } = useChangeRow();

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
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
			cell: ( cell ) => <Checkbox disabled className="readOnly" value={ cell.getValue() === 'FOLLOW_ALL_LINKS' } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 90,
		} ),
		columnHelper?.accessor( 'analyze_text', {
			cell: ( cell ) => <Checkbox disabled className="readOnly" value={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 90,
		} ),
		columnHelper?.accessor( 'take_screenshot', {
			cell: ( cell ) => <Checkbox disabled className="readOnly" value={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 90,
		} ),
		columnHelper?.accessor( 'process_all_sitemaps', {
			cell: ( cell ) => <Checkbox disabled className="readOnly" value={ cell.getValue() } />,
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

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table', 'urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The URLsLab plugin performs a variety of tasks, including taking screenshots, processing text, and generating summaries. These tasks are executed in the background on our servers and later synced with your WordPress database. This table displays scheduled tasks set to crawl specific domains or URLs at predetermined intervals. Each task performed by the URLsLab Service uses credits from your account. Therefore, it is essential to strategically select the scanning intervals for data from defined URLs and the types of tasks, so that credits are used efficiently.', 'urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom noFiltering noCount hideActions />

			<Table
				className="fadeInto"
				columns={ columns }
				data={ isSuccess && tableData }
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
		urls: <InputField liveUpdate description={ __( 'Add domain to schedule it in URLsLab. Be ready to boost your website with detailed reports', 'urlslab' ) } defaultValue="" label={ header.urls } onChange={ ( val ) => setRowToEdit( { urls: val } ) } required />,
		analyze_text: <SingleSelectMenu description={ __( '', 'urlslab' ) } defaultAccept autoClose items={ analyzeTextTypes } name="analyze_text" defaultValue="1" onChange={ ( val ) => setRowToEdit( { analyze_text: val } ) }>{ header.analyze_text }</SingleSelectMenu>,
		follow_links: <SingleSelectMenu description={ __( 'Helps to discover more pages by following all the links in your pages', 'urlslab' ) } defaultAccept autoClose items={ followLinksTypes } name="follow_links" defaultValue={ 'FOLLOW_ALL_LINKS' } onChange={ ( val ) => setRowToEdit( { follow_links: val } ) }>{ header.follow_links }</SingleSelectMenu>,
		process_all_sitemaps: <SingleSelectMenu description={ __( '', 'urlslab' ) } defaultAccept autoClose items={ processSitemapsTypes } name="process_all" defaultValue="1" onChange={ ( val ) => setRowToEdit( { process_all_sitemaps: val } ) }>{ header.process_all_sitemaps }</SingleSelectMenu>,
		take_screenshot: <SingleSelectMenu description={ __( '', 'urlslab' ) } defaultAccept autoClose items={ takeScreenshotsTypes } name="take_screenshot" defaultValue="1" onChange={ ( val ) => setRowToEdit( { take_screenshot: val } ) }>{ header.take_screenshot }</SingleSelectMenu>,
		scan_frequency: <SingleSelectMenu description={ __( 'The frequency you want your domains to be crawled', 'urlslab' ) } defaultAccept autoClose items={ scanFrequencyTypes } name="scan_frequency" defaultValue={ 'MONTHLY' } onChange={ ( val ) => setRowToEdit( { scan_frequency: val } ) }>{ header.scan_frequency }</SingleSelectMenu>,
		scan_speed_per_minute: <InputField description={ __( 'Choose this wisely to avoid crashing your website and hosting', 'urlslab' ) } type="number" liveUpdate defaultValue="20" label={ header.scan_speed_per_minute } onChange={ ( val ) => setRowToEdit( { scan_speed_per_minute: val } ) } />,
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
