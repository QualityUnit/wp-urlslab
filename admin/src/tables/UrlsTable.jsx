import { memo, useCallback, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch,
	SortBy,
	Tooltip,
	SingleSelectMenu,
	Checkbox,
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
	RowActionButtons, TextArea,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import { langName } from '../lib/helpers';

import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import DescriptionBox from '../elements/DescriptionBox';

const paginationId = 'url_id';

const scrStatusTypes = {
	'': __( 'Not requested' ),
	N: __( 'Waiting' ),
	A: __( 'Done' ),
	P: __( 'Pending' ),
	U: __( 'Updating' ),
	E: __( 'Error' ),
};

const sumStatusTypes = {
	'': __( 'Not requested' ),
	N: __( 'Waiting' ),
	A: __( 'Done' ),
	P: __( 'Pending' ),
	U: __( 'Updating' ),
	E: __( 'Error' ),
};

const httpStatusTypes = {
	'-2': __( 'Processing' ),
	'-1': __( 'Waiting' ),
	200: __( 'Valid' ),
	400: __( '400 Client Error' ),
	401: __( '401 Unauthorized' ),
	301: __( 'Moved Permanently' ),
	302: __( 'Found, Moved temporarily' ),
	307: __( 'Temporary Redirect' ),
	308: __( 'Permanent Redirect' ),
	404: __( '404 Not Found' ),
	405: __( '405 Method Not Allowed' ),
	406: __( '406 Not Acceptable' ),
	410: __( '410 Gone' ),
	403: __( '403 Forbidden' ),
	500: __( '500 Internal Server Error' ),
	503: __( '503 Service Unavailable' ),
};

const visibilityTypes = {
	V: __( 'Visible' ),
	H: __( 'Hidden' ),
};

const relScheduleTypes = {
	'': __( 'Not requested' ),
	A: __( 'Done' ),
	N: __( 'New' ),
	M: __( 'Manual' ),
	S: __( 'Scheduled' ),
	E: __( 'Error' ),
};

const header = {
	url_name: __( 'URL' ),
	url_title: __( 'Title' ),
	url_h1: __( 'H1 tag' ),
	url_meta_description: __( 'Description' ),
	url_summary: __( 'Summary' ),
	visibility: __( 'Visibility' ),
	url_priority: __( 'SEO rank' ),
	url_links_count: __( 'Outgoing links count' ),
	url_usage_cnt: __( 'Incoming links count' ),
	url_lang: __( 'Language' ),
	http_status: __( 'HTTP status' ),
	update_http_date: __( 'HTTP status change' ),
	scr_status: __( 'Screenshot status' ),
	update_scr_date: __( 'Screenshot status change' ),
	screenshot_usage_count: __( 'Screenshot usage' ),
	sum_status: __( 'Summary status' ),
	update_sum_date: __( 'Summary status change' ),
	rel_schedule: __( 'Related Articles' ),
	rel_updated: __( 'Related Articles Changed' ),
	labels: __( 'Tags' ),
};
export default function UrlsTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow();

	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const setOptions = useTablePanels( ( state ) => state.setOptions );

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
						title: __( 'Outgoing links' ), text: `URL: ${ origCell.url_name }`, slug, url: `${ origCell.url_id }/links`, showKeys: [ { name: [ 'dest_url_name', 'Destination URL' ] } ], listId: 'dest_url_id', counter,
					},
				},
			origCell.url_usage_cnt > 0 && {
				detailsOptions: {
					title: __( 'Incoming links' ), text: `URL: ${ origCell.url_name }`, slug, url: `${ origCell.url_id }/linked-from`, showKeys: [ { name: [ 'src_url_name', 'Source URL' ] } ], listId: 'src_url_id', counter,
				},
			},
			origCell.screenshot_usage_count > 0 && {
				detailsOptions: {
					title: __( 'Screenshot used on Pages' ), slug: `${ slug }/screenshot`, url: `${ origCell.url_id }/linked-from`, showKeys: [ { name: [ 'src_url_name', __( 'URL' ) ] } ], listId: 'src_url_id', counter,
				},
			},
		] );
	}, [ setOptions, setRowToEdit, slug ] );

	const ActionHTTPStatusButton = useMemo( () => ( { cell, onClick } ) => {
		const { http_status } = cell?.row?.original;

		return (
			http_status > 0 &&
			<Tooltip title={ __( 'Re-check status' ) } disablePortal>
				<IconButton size="xs" onClick={ () => onClick( '-2' ) }>
					<SvgIcon name="refresh" />
				</IconButton>
			</Tooltip>
		);
	}, [] );

	const ActionScrStatusButton = useMemo( () => ( { cell, onClick } ) => {
		const { scr_status } = cell?.row?.original;

		return (
			( scr_status === 'A' || scr_status === 'E' || scr_status === '' ) &&
			<Tooltip title={ __( 'Request new Screenshot' ) } disablePortal>
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
			<Tooltip title={ __( 'Update Related Articles' ) } disablePortal>
				<IconButton size="xs" onClick={ () => onClick( 'N' ) }>
					<SvgIcon name="refresh" />
				</IconButton>
			</Tooltip>
		);
	}, [] );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						paginationId,
						slug,
						header,
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
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
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
			cell: ( cell ) => {
				// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
				return <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>;
			},
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
		columnHelper?.accessor( 'url_meta_description', {
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
			filterValMenu: visibilityTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu defaultAccept autoClose items={ visibilityTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'url_priority', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() } min="0" max="100" onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'url_links_count', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ cell?.getValue() }</span>
						{ cell?.getValue() > 0 &&
							<Tooltip title={ __( 'Show URLs where used' ) } disablePortal>
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
							<Tooltip title={ __( 'Show URLs where used' ) } disablePortal>
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
		columnHelper?.accessor( 'http_status', {
			filterValMenu: httpStatusTypes,
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ httpStatusTypes[ cell?.getValue() ] ? httpStatusTypes[ cell?.getValue() ] : cell?.getValue() }</span>
						<ActionHTTPStatusButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'http_status', newVal: val, cell } ) } />
					</>
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'update_http_date', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper?.accessor( 'scr_status', {
			filterValMenu: scrStatusTypes,
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ scrStatusTypes[ cell.getValue() ] }</span>
						<ActionScrStatusButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'scr_status', newVal: val, cell } ) } />
					</>
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper?.accessor( 'update_scr_date', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper?.accessor( 'screenshot_usage_count', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ cell?.getValue() }</span>
						{ cell?.getValue() > 0 &&
							<Tooltip title={ __( 'Show pages where is screenshot used' ) } >
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

		columnHelper?.accessor( 'sum_status', {
			filterValMenu: sumStatusTypes,
			cell: ( cell ) => sumStatusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper?.accessor( 'update_sum_date', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper.accessor( 'rel_schedule', {
			filterValMenu: relScheduleTypes,
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ relScheduleTypes[ cell.getValue() ] }</span>
						<ActionRelStatusButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'rel_schedule', newVal: val, cell } ) } />
					</>
				</Stack>
			),

			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper?.accessor( 'rel_updated', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),

		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
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
							setOptions( { changesPanel: { title: cell.row.original.url_name, slug: `url/${ cell.row.original.url_id }/changes` } } );
							activatePanel( 'changesPanel' );
						} }
						sx={ { mr: 1 } }
					>
						{ __( 'Show changes' ) }
					</Button>
				}
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ activatePanel, columnHelper, deleteRow, isSelected, selectRows, setOptions, setUnifiedPanel, showChanges, slug, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The table displays the links found on your website during page generation. A background cron process evaluates these links for their accessibility to your site's visitors upon detection. This plugin offers features such as concealing all links that lead to invalid or non-existent URLs. Additionally, it provides a detailed overview of all internal and external links used on your website." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noImport
			/>
			<Table className="fadeInto"
				initialState={ {
					columnVisibility: {
						url_h1: false, url_meta_description: false, url_lang: false,
						update_http_date: false, scr_status: false, sum_status: false,
						update_scr_date: false, update_sum_date: false,
						rel_schedule: false, rel_updated: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
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

	const rowEditorCells = useMemo( () => ( {
		url_title: <InputField defaultValue="" label={ header.url_title } onChange={ ( val ) => setRowToEdit( { url_title: val } ) } />,
		url_meta_description: <TextArea rows="5" description=""
			liveUpdate defaultValue="" label={ header.url_meta_description } onChange={ ( val ) => setRowToEdit( { url_meta_description: val } ) } />,
		url_summary: <TextArea rows="5" description=""
			liveUpdate defaultValue="" label={ header.url_summary } onChange={ ( val ) => setRowToEdit( { url_summary: val } ) } />,
		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,
		visibility: <SingleSelectMenu defaultAccept autoClose items={ visibilityTypes } label={ header.visibility } name={ header.visibility } onChange={ ( val ) => setRowToEdit( { visibility: val } ) } />,
		url_priority: <InputField type="number" defaultValue={ 1 } label={ header.url_priority } min="0" max="100" onChange={ ( val ) => setRowToEdit( { url_priority: val } ) } />,
	} ), [ setRowToEdit, slug ] );

	useEffect( () => {
		useTablePanels.setState( ( ) => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ 'urlslab_url_id', 'url_id', 'urlslab_domain_id' ],
			}
		) );
	}, [ rowEditorCells ] );
} );
