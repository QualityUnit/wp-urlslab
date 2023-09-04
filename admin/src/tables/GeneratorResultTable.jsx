import { useEffect, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
import {
	useInfiniteFetch, Tooltip, Checkbox, ProgressBar, SortBy, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat, LinkIcon, TagsMenu, SingleSelectMenu, TextArea, AcceptIcon, DisableIcon, RefreshIcon, IconButton, RowActionButtons,
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
					<IconButton className="mr-s c-saturated-green"
						tooltip={ __( 'Accept' ) }
						tooltipClass="align-left" onClick={ () => onClick( 'A' ) }>
						<AcceptIcon />
					</IconButton>
				}
				{
					( status === 'P' || status === 'W' || status === 'A' || status === 'N' ) &&
					<IconButton className="mr-s c-saturated-red"
						tooltip={ __( 'Decline' ) }
						tooltipClass="align-left" onClick={ () => onClick( 'D' ) }>
						<DisableIcon />
					</IconButton>
				}
				{
					( status === 'A' || status === 'D' || status === 'P' ) &&
					<IconButton className="mr-s"
						tooltip={ __( 'Regenerate' ) }
						tooltipClass="align-left" onClick={ () => onClick( 'N' ) }>
						<RefreshIcon />
					</IconButton>
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

	const { resetTableStore } = useTableStore();

	const { activatePanel, setRowToEdit, setOptions, resetPanelsStore } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell } );

		if ( origCell.usage_count > 0 ) {
			setOptions( [ {
				detailsOptions: {
					title: `Shortcode used on these URLs`, slug, url: `${ origCell.shortcode_id }/${ origCell.hash_id }/urls`, showKeys: [ { name: 'url_name' }, { name: 'created' } ], listId: 'url_id',
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
		command: __( 'Command' ),
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
		resetTableStore();
		resetPanelsStore();
		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'hash_id' ],
			}
		) );
	}, [] );

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
				paginationId,
				slug,
				header,
			}
		) );
	}, [ data ] );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				cell.row.toggleSelected();
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
				selectRows( val ? head : undefined );
			} } />,
		} ),
		columnHelper.accessor( 'shortcode_id', {
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper.accessor( 'prompt_variables', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'semantic_context', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'url_filter', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'result', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
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
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => {
						setUnifiedPanel( cell );
						activatePanel( 0 );
					} }>
						<LinkIcon />
						<Tooltip>{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
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
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				noImport
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { semantic_context: false, command: false, url_filter: false, labels: false } } }
				columns={ columns }
				data={
					isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
				}
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
