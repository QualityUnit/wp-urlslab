import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Tooltip,
	Trash,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	InputField, SingleSelectMenu,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

import '../assets/styles/components/_ModuleViewHeader.scss';

export default function SchedulesTable( { slug } ) {
	const paginationId = 'schedule_id';
	const { table, setTable, filters, sorting, sortBy } = useTableUpdater( { slug } );

	const url = { filters, sorting };

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

	const { row, selectedRows, selectRow, rowToEdit, setEditorRow, activePanel, setActivePanel, deleteRow, deleteSelectedRows } = useChangeRow( { data, url, slug, paginationId } );

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
		analyze_text: __( 'Analyze text' ),
		follow_links: __( 'Follow links' ),
		process_all_sitemaps: __( 'Process all sitemaps' ),
		take_screenshot: __( 'Take screenshot' ),
		custom_sitemaps: __( 'Sitemaps' ),
		scan_frequency: __( 'Scan frequency' ),
		scan_speed_per_minute: __( 'Scan speed (Pages/min)' ),
	};
	const rowEditorCells = {
		urls: <InputField liveUpdate defaultValue="" label={ header.urls } onChange={ ( val ) => setEditorRow( { ...rowToEdit, urls: val } ) } required />,
		analyze_text: <SingleSelectMenu defaultAccept autoClose items={ analyzeTextTypes } name="analyze_text" defaultValue="1" onChange={ ( val ) => setEditorRow( { ...rowToEdit, analyze_text: val } ) }>{ header.analyze_text }</SingleSelectMenu>,
		follow_links: <SingleSelectMenu defaultAccept autoClose items={ followLinksTypes } name="follow_links" defaultValue={ 'FOLLOW_ALL_LINKS' } onChange={ ( val ) => setEditorRow( { ...rowToEdit, follow_links: val } ) }>{ header.follow_links }</SingleSelectMenu>,
		process_all_sitemaps: <SingleSelectMenu defaultAccept autoClose items={ processSitemapsTypes } name="process_all" defaultValue="1" onChange={ ( val ) => setEditorRow( { ...rowToEdit, process_all_sitemaps: val } ) }>{ header.process_all_sitemaps }</SingleSelectMenu>,
		custom_sitemaps: <InputField liveUpdate defaultValue="" label={ header.custom_sitemaps } onChange={ ( val ) => setEditorRow( { ...rowToEdit, custom_sitemaps: val } ) } />,
		take_screenshot: <SingleSelectMenu defaultAccept autoClose items={ takeScreenshotsTypes } name="take_screenshot" defaultValue="1" onChange={ ( val ) => setEditorRow( { ...rowToEdit, take_screenshot: val } ) }>{ header.take_screenshot }</SingleSelectMenu>,
		scan_frequency: <SingleSelectMenu defaultAccept autoClose items={ scanFrequencyTypes } name="scan_frequency" defaultValue={ 'ONE_TIME' } onChange={ ( val ) => setEditorRow( { ...rowToEdit, scan_frequency: val } ) }>{ header.scan_frequency }</SingleSelectMenu>,
		scan_speed_per_minute: <InputField liveUpdate defaultValue="20" label={ header.scan_speed_per_minute } onChange={ ( val ) => setEditorRow( { ...rowToEdit, scan_speed_per_minute: val } ) } />,
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
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.urls }</SortBy>,
			size: 300,
		} ),
		columnHelper?.accessor( 'analyze_text', {
			cell: ( cell ) => <Checkbox readOnly className="readOnly" checked={ cell.getValue() } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.analyze_text }</SortBy>,
			size: 120,
		} ),
		columnHelper?.accessor( 'follow_links', {
			filterValMenu: followLinksTypes,
			cell: ( cell ) => followLinksTypes[ cell?.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.follow_links }</SortBy>,
			size: 150,
		} ),
		columnHelper?.accessor( 'process_all_sitemaps', {
			cell: ( cell ) => <Checkbox readOnly className="readOnly" checked={ cell.getValue() } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.process_all_sitemaps }</SortBy>,
			size: 150,
		} ),
		columnHelper.accessor( 'scan_frequency', {
			filterValMenu: scanFrequencyTypes,
			cell: ( cell ) => scanFrequencyTypes[ cell?.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.scan_frequency }</SortBy>,
			size: 90,
		} ),
		columnHelper.accessor( 'scan_speed_per_minute', {
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.scan_speed_per_minute }</SortBy>,
			size: 120,
		} ),
		columnHelper?.accessor( 'take_screenshot', {
			cell: ( cell ) => <Checkbox readOnly className="readOnly" checked={ cell.getValue() } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.take_screenshot }</SortBy>,
			size: 90,
		} ),
		columnHelper?.accessor( 'custom_sitemaps', {
			cell: ( array ) => array?.getValue().map( ( sitemap ) => <><a href={ sitemap } target="_blank" rel="noreferrer" key={ sitemap }>{ sitemap }</a>, </>,
			),
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.custom_sitemaps }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { cell } ) } />,
			header: null,
			size: 60,
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
				noFiltering
				noCount
				noExport
				noDelete
				selectedRows={ selectedRows }
				onDeleteSelected={ deleteSelectedRows }
				onUpdateRow={ ( val ) => {
					setActivePanel();
					setEditorRow();
					if ( val === 'rowInserted' || val === 'rowChanged' ) {
						setActivePanel();
						setEditorRow( val );
						setTimeout( () => {
							setEditorRow();
						}, 3000 );
					}
				} }
				activatePanel={ activePanel }
				rowEditorOptions={ { rowEditorCells, title: 'Add schedule', data, slug, url, paginationId, rowToEdit } }
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
				{ ( rowToEdit === 'rowChanged' )
					? <Tooltip center>{ __( 'Schedule has been changed.' ) }</Tooltip>
					: null
				}
				{ ( rowToEdit === 'rowInserted' )
					? <Tooltip center>{ __( 'Schedule has been added.' ) }</Tooltip>
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
