import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch,
	SortBy,
	Tooltip,
	SingleSelectMenu,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	DateTimeFormat,
	TagsMenu,
	Button,
	InputField,
	IconButton,
	SvgIcon,
	RowActionButtons, TextArea, TableSelectCheckbox,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';
import { langName } from '../lib/helpers';

import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import DescriptionBox from '../elements/DescriptionBox';

const paginationId = 'url_id';

const header = {
	url_name: __( 'URL', 'urlslab' ),
	url_title: __( 'Title', 'urlslab' ),
	url_h1: __( 'H1 tag', 'urlslab' ),
	url_meta_description: __( 'Description', 'urlslab' ),
	url_summary: __( 'Summary', 'urlslab' ),
	visibility: __( 'Visibility', 'urlslab' ),
	url_priority: __( 'SEO rank', 'urlslab' ),
	url_links_count: __( 'Outgoing links count', 'urlslab' ),
	url_usage_cnt: __( 'Incoming links count', 'urlslab' ),
	url_lang: __( 'Language', 'urlslab' ),
	url_type: __( 'Type', 'urlslab' ),
	http_status: __( 'HTTP status', 'urlslab' ),
	content_type: __( 'Content Type', 'urlslab' ),
	update_http_date: __( 'HTTP status change', 'urlslab' ),
	scr_status: __( 'Screenshot status', 'urlslab' ),
	update_scr_date: __( 'Screenshot status change', 'urlslab' ),
	screenshot_usage_count: __( 'Screenshot usage', 'urlslab' ),
	sum_status: __( 'Summary status', 'urlslab' ),
	update_sum_date: __( 'Summary status change', 'urlslab' ),
	rel_schedule: __( 'Related Articles', 'urlslab' ),
	rel_updated: __( 'Related Articles Changed', 'urlslab' ),
	attributes: __( 'Attributes', 'urlslab' ),
	labels: __( 'Tags', 'urlslab' ),
};
const initialState = { columnVisibility: {
	url_h1: false, url_meta_description: false, url_lang: false,
	update_http_date: false, scr_status: false, sum_status: false,
	update_scr_date: false, update_sum_date: false,
	rel_schedule: false, rel_updated: false, attributes: false, url_type: false,
} };

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			paginationId,
			slug,
			header,
		} );
	}, [ setTable, slug ] );

	return init && <UrlsTable slug={ slug } />;
}

function UrlsTable( { slug } ) {
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
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const setOptions = useTablePanels( ( state ) => state.setOptions );

	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );
	const { deleteRow, updateRow } = useChangeRow();

	const showChanges = useCallback( ( cell ) => {
		const { http_status, urlslab_scr_timestamp, urlslab_sum_timestamp, scr_status } = cell?.row?.original;
		if ( http_status > 299 || http_status <= 0 || scr_status === 'E' || ! scr_status ) {
			return false;
		}

		return urlslab_scr_timestamp !== 0 || urlslab_sum_timestamp !== 0;
	}, [] );

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		const counter = cell?.getValue();
		setOptions( [] );
		setRowToEdit( {} );

		setOptions( [
			origCell.url_links_count > 0 &&
				{
					detailsOptions: {
						title: __( 'Outgoing links', 'urlslab' ),
						text: `URL: ${ origCell.url_name }`,
						slug,
						url: `${ origCell.url_id }/links`,
						showKeys: [ { name: [ 'dest_url_name', __( 'Destination URL', 'urlslab' ) ] } ],
						listId: 'dest_url_id',
						counter,
					},
				},
			origCell.url_usage_cnt > 0 && {
				detailsOptions: {
					title: __( 'Incoming links', 'urlslab' ),
					text: `URL: ${ origCell.url_name }`,
					slug,
					url: `${ origCell.url_id }/linked-from`,
					showKeys: [ { name: [ 'src_url_name', __( 'Source URL', 'urlslab' ) ] } ],
					listId: 'src_url_id',
					counter,
				},
			},
			origCell.screenshot_usage_count > 0 && {
				detailsOptions: {
					title: __( 'Screenshot used on Pages', 'urlslab' ),
					slug: `${ slug }/screenshot`,
					url: `${ origCell.url_id }/linked-from`,
					showKeys: [ { name: [ 'src_url_name', __( 'URL', 'urlslab' ) ] } ],
					listId: 'src_url_id',
					counter,
				},
			},
		] );
	}, [ setOptions, setRowToEdit, slug ] );

	const ActionHTTPStatusButton = useMemo( () => ( { cell, onClick } ) => {
		const { http_status } = cell?.row?.original;

		return (
			http_status > 0 &&
			<Tooltip title={ __( 'Re-check status', 'urlslab' ) } arrow placement="bottom">
				<IconButton size="xs" onClick={ () => onClick( '-1' ) }>
					<SvgIcon name="refresh" />
				</IconButton>
			</Tooltip>
		);
	}, [] );

	const ActionScrStatusButton = useMemo( () => ( { cell, onClick } ) => {
		const { scr_status } = cell?.row?.original;

		return (
			( scr_status === 'A' || scr_status === 'E' || scr_status === '' ) &&
			<Tooltip title={ __( 'Request new Screenshot', 'urlslab' ) } arrow placement="bottom">
				<IconButton size="xs" onClick={ () => onClick( 'N' ) }>
					<SvgIcon name="refresh" />
				</IconButton>
			</Tooltip>
		);
	}, [] );

	const ActionRelStatusButton = useMemo( () => ( { cell, onClick } ) => {
		const { rel_schedule } = cell?.row?.original;

		return (
			( rel_schedule === 'A' || rel_schedule === 'E' ) &&
			<Tooltip title={ __( 'Update Related Articles', 'urlslab' ) } arrow placement="bottom">
				<IconButton size="xs" onClick={ () => onClick( 'N' ) }>
					<SvgIcon name="refresh" />
				</IconButton>
			</Tooltip>
		);
	}, [] );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.row.original.screenshot_url_thumbnail ? <Box
				component="img"
				src={ cell.row.original.screenshot_url_thumbnail }
				alt="url"
				sx={ {
					// just show image nice with tooltip corners
					borderRadius: 'var(--urlslab-radius-sm)',
					display: 'block',
					marginY: 0.25,
					maxWidth: '15em',
				} }
			/> : cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'url_title', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 120,
		} ),
		columnHelper.accessor( 'url_h1', {
			tooltip: ( cell ) => cell.getValue(),
			header: header.url_h1,
			size: 120,
		} ),
		columnHelper.accessor( 'url_meta_description', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 120,
		} ),
		columnHelper.accessor( 'url_summary', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'visibility', {
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu defaultAccept autoClose items={ columnTypes?.visibility.values } name={ cell.column.id }
				value={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'url_priority', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" value={ cell.getValue() } min="0" max="100"
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'url_links_count', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ cell?.getValue() }</span>
						{ cell?.getValue() > 0 &&
							<Tooltip title={ __( 'Show URLs where used', 'urlslab' ) } arrow placement="bottom">
								<IconButton
									size="xs"
									onClick={ () => {
										setUnifiedPanel( cell );
										activatePanel( 0 );
									} }
								>
									<SvgIcon name="link" />
								</IconButton>
							</Tooltip>
						}
					</>
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 70,
		} ),
		columnHelper.accessor( 'url_usage_cnt', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ cell?.getValue() }</span>
						{ cell?.getValue() > 0 &&
							<Tooltip title={ __( 'Show URLs where used', 'urlslab' ) } arrow placement="bottom">
								<IconButton
									size="xs"
									onClick={ () => {
										setUnifiedPanel( cell );
										activatePanel( 1 );
									} }
								>
									<SvgIcon name="link" />
								</IconButton>
							</Tooltip>
						}
					</>
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 70,
		} ),
		columnHelper.accessor( 'url_lang', {
			className: 'nolimit',
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => langName( cell?.getValue() ),
			header: header.url_lang,
			size: 110,
		} ),
		columnHelper.accessor( 'url_type', {
			cell: ( cell ) => <span>{ columnTypes?.url_type.values[ cell?.getValue() ] ? columnTypes?.url_type.values[ cell?.getValue() ] : cell?.getValue() }</span>,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'http_status', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<ActionHTTPStatusButton cell={ cell } onClick={ ( val ) => updateRow( {
							changeField: 'http_status',
							newVal: val,
							cell,
						} ) } />
						<span>{ columnTypes?.http_status.values[ cell?.getValue() ] ? columnTypes?.http_status.values[ cell?.getValue() ] : cell?.getValue() }</span>
					</>
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'content_type', {
			header: ( th ) => <SortBy { ...th } />,
			size: 40,
		} ),
		columnHelper.accessor( 'update_http_date', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper.accessor( 'scr_status', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ columnTypes?.scr_status.values[ cell.getValue() ] }</span>
						<ActionScrStatusButton cell={ cell } onClick={ ( val ) => updateRow( {
							changeField: 'scr_status',
							newVal: val,
							cell,
						} ) } />
					</>
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'update_scr_date', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper.accessor( 'screenshot_usage_count', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ cell?.getValue() }</span>
						{ cell?.getValue() > 0 &&
						<Tooltip title={ __( 'Show pages where is screenshot used', 'urlslab' ) }>
							<IconButton
								size="xs"
								onClick={ () => {
									setUnifiedPanel( cell );
									activatePanel( 2 );
								} }
							>
								<SvgIcon name="link" />
							</IconButton>
						</Tooltip>
						}
					</>
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 60,
		} ),

		columnHelper.accessor( 'sum_status', {
			cell: ( cell ) => columnTypes?.sum_status.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'update_sum_date', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper.accessor( 'rel_schedule', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ columnTypes?.rel_schedule.values[ cell.getValue() ] }</span>
						<ActionRelStatusButton cell={ cell } onClick={ ( val ) => updateRow( {
							changeField: 'rel_schedule',
							newVal: val,
							cell,
						} ) } />
					</>
				</Stack>
			),

			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'rel_updated', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper.accessor( 'attributes', {
			cell: ( cell ) => cell.getValue(),
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 40,
		} ),

		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu value={ cell.getValue() } slug={ slug }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 160,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell, id: 'url_name' } ) }
				onDelete={ () => deleteRow( { cell, id: 'url_name' } ) }
			>
				{
					showChanges( cell ) &&
					<Button
						size="xxs"
						onClick={ () => {
							setOptions( {
								changesPanel: {
									title: cell.row.original.url_name,
									slug: `url/${ cell.row.original.url_id }/changes`,
								},
							} );
							activatePanel( 'changesPanel' );
						} }
						sx={ { mr: 1 } }
					>
						{ __( 'Show changes', 'urlslab' ) }
					</Button>
				}
				{
					cell.row.original.edit_url_name?.length > 0 &&
					<Tooltip title={ __( 'Edit Post', 'urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" component="a" href={ cell.row.original.edit_url_name } target="_blank">
							<SvgIcon name="edit-post" />
						</IconButton>
					</Tooltip>
				}
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ activatePanel, columnHelper, columnTypes, deleteRow, setOptions, setUnifiedPanel, showChanges, slug, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading || isLoadingColumnTypes ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox title={ __( 'About this table', 'urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The table displays the links found on your website during page generation. A background cron process evaluates these links for their accessibility to your site's visitors upon detection. This plugin offers features such as concealing all links that lead to invalid or non-existent URLs. Additionally, it provides a detailed overview of all internal and external links used on your website.", 'urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom noImport />

			<Table
				className="fadeInto"
				initialState={ initialState }
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>

			<TableEditorManager slug={ slug } />
		</>
	);
}

const TableEditorManager = memo( ( { slug } ) => {
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );

	const { columnTypes } = useColumnTypesQuery( slug );

	const rowEditorCells = useMemo( () => ( {
		url_title: <InputField defaultValue="" label={ header.url_title }
			onChange={ ( val ) => setRowToEdit( { url_title: val } ) } />,
		url_meta_description: <TextArea rows="5" description=""
			liveUpdate defaultValue="" label={ header.url_meta_description }
			onChange={ ( val ) => setRowToEdit( { url_meta_description: val } ) } />,
		url_summary: <TextArea rows="5" description=""
			liveUpdate defaultValue="" label={ header.url_summary }
			onChange={ ( val ) => setRowToEdit( { url_summary: val } ) } />,
		labels: <TagsMenu optionItem label={ __( 'Tags:', 'urlslab' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,
		visibility: <SingleSelectMenu defaultAccept autoClose items={ columnTypes?.visibility.values } label={ header.visibility }
			name={ header.visibility } onChange={ ( val ) => setRowToEdit( { visibility: val } ) } />,
		url_priority: <InputField type="number" defaultValue={ 1 } label={ header.url_priority } min="0" max="100"
			onChange={ ( val ) => setRowToEdit( { url_priority: val } ) } />,
	} ), [ columnTypes?.visibility, setRowToEdit, slug ] );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ 'urlslab_url_id', 'url_id', 'urlslab_domain_id' ],
			}
		) );
	}, [ rowEditorCells ] );
} );
