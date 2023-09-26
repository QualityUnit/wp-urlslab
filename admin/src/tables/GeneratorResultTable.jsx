import { useEffect, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
import {
	useInfiniteFetch, Tooltip, Checkbox, ProgressBar, SortBy, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat, LinkIcon, TagsMenu, SingleSelectMenu, TextArea, AcceptIcon, DisableIcon, RefreshIcon, IconButton, RowActionButtons, Stack,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';

export default function GeneratorResultTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'hash_id';

	const ActionButton = ( { cell, onClick } ) => {
		const { status } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( status === 'W' || status === 'D' ) &&
					<Tooltip title={ __( 'Accept' ) }>
						<IconButton size="xs" color="success" onClick={ () => onClick( 'A' ) }>
							<AcceptIcon />
						</IconButton>
					</Tooltip>
				}
				{
					( status === 'P' || status === 'W' || status === 'A' || status === 'N' ) &&
					<Tooltip title={ __( 'Decline' ) }>
						<IconButton size="xs" color="danger" onClick={ () => onClick( 'D' ) }>
							<DisableIcon />
						</IconButton>
					</Tooltip>
				}
				{
					( status === 'A' || status === 'D' || status === 'P' ) &&
					<Tooltip title={ __( 'Regenerate' ) }>
						<IconButton size="xs" color="neutral" onClick={ () => onClick( 'N' ) }>
							<RefreshIcon />
						</IconButton>
					</Tooltip>
				}
			</div>
		);
	};

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { selectRows, deleteRow, updateRow } = useChangeRow();

	const { activatePanel, setRowToEdit, setOptions } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell } );

		if ( origCell.usage_count > 0 ) {
			setOptions( [ {
				detailsOptions: {
					title: `Shortcode used on these URLs`, slug, url: `${ origCell.shortcode_id }/${ origCell.hash_id }/urls`, showKeys: [ { name: [ 'url_name', 'URL' ] }, { name: [ 'created', 'Created' ] } ], perPage: 999, listId: 'url_id',
				},
			} ] );
		}
	}, [ setOptions, setRowToEdit, slug ] );

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

	const rowEditorCells = {
		status: <SingleSelectMenu autoClose defaultAccept description=""
			items={ statusTypes } name="statusTypes" defaultValue="W" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, status: val } ) }>{ header.status }</SingleSelectMenu>,

		result: <TextArea rows="5" description=""
			liveUpdate defaultValue="" label={ header.result } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, result: val } ) } />,
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'hash_id' ],
			}
		) );
		useTableStore.setState( () => (
			{
				paginationId,
				slug,
				header,
			}
		) );
	}, [] );

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
			}
		) );
	}, [ data ] );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
			} } />,
		} ),
		columnHelper.accessor( 'shortcode_id', {
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper.accessor( 'prompt_variables', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue().replace( /\\u([0-9a-fA-F]{4})/g, ( u ) => String.fromCharCode( '0x' + u.slice( 2 ) ) ), // Fixes double \\u which are not properly parsed
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
			tooltip: ( cell ) => cell.getValue(),
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
							<Tooltip title={ __( 'Show URLs where used' ) }>
								<IconButton size="xs" onClick={ () => {
									setUnifiedPanel( cell );
									activatePanel( 0 );
								} }
								>
									<LinkIcon />
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
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				noImport
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { semantic_context: false, command: false, url_filter: false, labels: false } } }
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
