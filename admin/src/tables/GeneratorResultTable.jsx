import { useEffect, useCallback, memo, useMemo } from 'react';
import { __ } from '@wordpress/i18n/';
import {
	useInfiniteFetch, Tooltip, Checkbox, SortBy, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat, TagsMenu, SingleSelectMenu, TextArea, SvgIcon, IconButton, RowActionButtons, Stack,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';
import TreeView from '../elements/TreeView';

const paginationId = 'hash_id';

const statusTypes = {
	A: 'Active',
	N: 'New',
	P: 'Pending',
	W: 'Waiting approval',
	D: 'Disabled',
};

const header = {
	shortcode_id: __( 'Shortcode ID' ),
	prompt_variables: __( 'Input data' ),
	semantic_context: __( 'Semantic context' ),
	url_filter: __( 'URL filter' ),
	result: __( 'Result' ),
	status: __( 'Status' ),
	date_changed: __( 'Last change' ),
	usage_count: __( 'Usage' ),
	labels: __( 'Tags' ),
};

export default function GeneratorResultTable( { slug } ) {
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

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		const counter = cell?.getValue();
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell } );

		if ( origCell.usage_count > 0 ) {
			setOptions( [ {
				detailsOptions: {
					title: __( 'Shortcode used on these URLs' ), slug, counter, url: `${ origCell.shortcode_id }/${ origCell.hash_id }/urls`, showKeys: [ { name: [ 'url_name', 'URL' ] }, { name: [ 'created', 'Created' ] } ], perPage: 999, listId: 'url_id',
				},
			} ] );
		}
	}, [ setOptions, setRowToEdit, slug, updateRow ] );

	const ActionButton = useMemo( () => ( { cell, onClick } ) => {
		const { status: statusType } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( statusType === 'W' || statusType === 'D' ) &&
					<Tooltip title={ __( 'Accept' ) } disablePortal>
						<IconButton size="xs" color="success" onClick={ () => onClick( 'A' ) }>
							<SvgIcon name="activate" />
						</IconButton>
					</Tooltip>
				}
				{
					( statusType === 'P' || statusType === 'W' || statusType === 'A' || statusType === 'N' ) &&
					<Tooltip title={ __( 'Decline' ) } disablePortal>
						<IconButton size="xs" color="danger" onClick={ () => onClick( 'D' ) }>
							<SvgIcon name="disable" />
						</IconButton>
					</Tooltip>
				}
				{
					( statusType === 'A' || statusType === 'D' || statusType === 'P' ) &&
					<Tooltip title={ __( 'Regenerate' ) } disablePortal>
						<IconButton size="xs" color="neutral" onClick={ () => onClick( 'P' ) }>
							<SvgIcon name="refresh" />
						</IconButton>
					</Tooltip>
				}
			</div>
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
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
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
		columnHelper.accessor( 'semantic_context', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'url_filter', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'result', {
			cell: ( cell ) => <TreeView sourceData={ cell.getValue() } isTableCellPopper />,
			header: ( th ) => <SortBy { ...th } />,
			size: 220,
		} ),
		columnHelper.accessor( 'status', {
			filterValMenu: statusTypes,
			className: 'nolimit',
			cell: ( cell ) => statusTypes[ cell.getValue() ],
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
							<Tooltip title={ __( 'Show URLs where used' ) } disablePortal>
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
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
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
	], [ activatePanel, columnHelper, deleteRow, selectRows, setUnifiedPanel, slug, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table displays a list of texts that have already been produced by the AI generator shortcode. When the shortcode is placed on a specific page, it initiates an AI task. The text created by the AI generator is then stored in the result entry and subsequently presented on the page. The WordPress page does not directly contain the text; instead, it is incorporated into the page as it is generated. The page only includes the shortcode, which is then replaced with the actual text. The text generated by AI can be edited, approved, or declined to prevent the page from being spammed with inaccurate texts.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noImport
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { semantic_context: false, command: false, url_filter: false, labels: false } } }
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
	const { setRowToEdit } = useTablePanels( );

	const rowEditorCells = useMemo( () => ( {
		status: <SingleSelectMenu autoClose defaultAccept description=""
			items={ statusTypes } name="statusTypes" defaultValue="W" onChange={ ( val ) => setRowToEdit( { status: val } ) }>{ header.status }</SingleSelectMenu>,

		result: <TextArea rows="5" description=""
			liveUpdate defaultValue="" label={ header.result } onChange={ ( val ) => setRowToEdit( { result: val } ) } />,
	} ), [ setRowToEdit ] );

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
