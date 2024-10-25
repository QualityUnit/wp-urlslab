import { useEffect, useCallback, memo, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';
import {
	useInfiniteFetch, Tooltip, SortBy, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat, TagsMenu, SingleSelectMenu, TextArea, SvgIcon, IconButton, RowActionButtons, Stack, TableSelectCheckbox,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';
import TreeView from '../elements/TreeView';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

const paginationId = 'hash_id';
const header = {
	shortcode_id: __( 'Shortcode ID', 'urlslab' ),
	prompt_variables: __( 'Input data', 'urlslab' ),
	result: __( 'Result', 'urlslab' ),
	status: __( 'Status', 'urlslab' ),
	date_changed: __( 'Last change', 'urlslab' ),
	usage_count: __( 'Usage', 'urlslab' ),
	labels: __( 'Tags', 'urlslab' ),
};
const initialState = { columnVisibility: { command: false, labels: false } };

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

	return init && <GeneratorResultTable slug={ slug } />;
}

function GeneratorResultTable( { slug } ) {
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

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		const counter = cell?.getValue();
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell } );

		if ( origCell.usage_count > 0 ) {
			setOptions( [ {
				detailsOptions: {
					title: __( 'Shortcode used on these URLs', 'urlslab' ), slug, counter, url: `${ origCell.shortcode_id }/${ origCell.hash_id }/urls`, showKeys: [ { name: [ 'url_name', __( 'URL', 'urlslab' ) ] }, { name: [ 'created', __( 'Created', 'urlslab' ) ] } ], perPage: 999, listId: 'url_id',
				},
			} ] );
		}
	}, [ setOptions, setRowToEdit, slug, updateRow ] );

	const ActionButton = useMemo( () => ( { cell, onClick } ) => {
		const { status: statusType } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{ ( statusType === 'W' || statusType === 'D' ) &&
					<Tooltip title={ __( 'Accept', 'urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" color="success" onClick={ () => onClick( 'A' ) }>
							<SvgIcon name="activate" />
						</IconButton>
					</Tooltip>
				}
				{ ( statusType === 'P' || statusType === 'W' || statusType === 'A' || statusType === 'N' ) &&
					<Tooltip title={ __( 'Decline', 'urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" color="danger" onClick={ () => onClick( 'D' ) }>
							<SvgIcon name="disable" />
						</IconButton>
					</Tooltip>
				}
				{ ( statusType === 'A' || statusType === 'D' || statusType === 'P' ) &&
					<Tooltip title={ __( 'Regenerate', 'urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" color="neutral" onClick={ () => onClick( 'P' ) }>
							<SvgIcon name="refresh" />
						</IconButton>
					</Tooltip>
				}
			</div>
		);
	}, [] );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'shortcode_id', {
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper.accessor( 'prompt_variables', {
			cell: ( cell ) => <TreeView sourceData={ cell.getValue().replace( /\\u([0-9a-fA-F]{4})/g, ( u ) => String.fromCharCode( '0x' + u.slice( 2 ) ) ) } isTableCellPopper />, // Fixes double \\u which are not properly parsed
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'result', {
			cell: ( cell ) => <TreeView sourceData={ cell.getValue() } isTableCellPopper />,
			header: ( th ) => <SortBy { ...th } />,
			size: 220,
		} ),
		columnHelper.accessor( 'status', {
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.status.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 60,
		} ),
		columnHelper.accessor( 'date_changed', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper.accessor( 'usage_count', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ cell?.getValue() }</span>
						{ cell?.getValue() > 0 &&
							<Tooltip title={ __( 'Show URLs where used', 'urlslab' ) } arrow placement="bottom">
								<IconButton size="xs" onClick={ () => {
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
			header: header.usage_count,
			size: 60,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu value={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 150,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => setUnifiedPanel( cell ) }
				onDelete={ () => deleteRow( { cell } ) }
			>
				<ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'status', newVal: val, cell } ) } />
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ activatePanel, columnHelper, columnTypes, deleteRow, setUnifiedPanel, slug, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading || isLoadingColumnTypes ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table', 'urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table displays a list of texts that have already been produced by the AI generator shortcode. When the shortcode is placed on a specific page, it initiates an AI task. The text created by the AI generator is then stored in the result entry and subsequently presented on the page. The WordPress page does not directly contain the text; instead, it is incorporated into the page as it is generated. The page only includes the shortcode, which is then replaced with the actual text. The text generated by AI can be edited, approved, or declined to prevent the page from being spammed with inaccurate texts.', 'urlslab' ) }
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
	const { setRowToEdit } = useTablePanels( );
	const { columnTypes } = useColumnTypesQuery( slug );

	const rowEditorCells = useMemo( () => ( {
		result: <TextArea rows="5" allowResize description=""
			liveUpdate fullWidth fullHeight defaultValue="" label={ header.result } onChange={ ( val ) => setRowToEdit( { result: val } ) } />,

		status: <SingleSelectMenu autoClose defaultAccept fullWidth description=""
			items={ columnTypes?.status.values } name="statusTypes" defaultValue="W" onChange={ ( val ) => setRowToEdit( { status: val } ) }>{ header.status }</SingleSelectMenu>,

	} ), [ columnTypes?.status, setRowToEdit ] );

	useEffect( () => {
		useTablePanels.setState( ( ) => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'hash_id' ],
			}
		) );
	}, [ rowEditorCells ] );
} );
