/* eslint-disable indent */
import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Checkbox,
	Loader,
	Tooltip,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	TextArea,
	IconButton,
	RowActionButtons,
	TagsMenu,
	DateTimeFormat,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';

import { ReactComponent as DisableIcon } from '../assets/images/icons/icon-disable.svg';
import { ReactComponent as RefreshIcon } from '../assets/images/icons/icon-refresh.svg';
import Button from '../elements/Button';

export default function SerpQueriesTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add Query' );
	const paginationId = 'query_id';

	const defaultSorting = [ { key: 'comp_count', dir: 'DESC', op: '<' } ];

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

	const { activatePanel, setOptions, setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const ActionButton = ( { cell, onClick } ) => {
		const { status: serpStatus } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( serpStatus !== 'E' && serpStatus !== 'P' ) &&
					<IconButton className="mr-s c-saturated-red" tooltip={ __( 'Disable' ) } tooltipClass="align-left" onClick={ () => onClick( 'E' ) }>
						<DisableIcon />
					</IconButton>
				}
				{
					( serpStatus !== 'P' ) &&
					<IconButton className="mr-s" tooltip={ __( 'Process again' ) } tooltipClass="align-left" onClick={ () => onClick( 'X' ) }>
						<RefreshIcon />
					</IconButton>
				}
			</div>
		);
	};

	const statuses = {
		X: __( 'Not processed' ),
		P: __( 'Processing' ),
		A: __( 'Processed' ),
		E: __( 'Disabled' ),
		S: __( 'Irrelevant' ),
	};

	const types = {
		U: __( 'User' ),
		C: __( 'Search Console' ),
		S: __( 'People also search for' ),
		F: __( 'People also ask' ),
	};

	const header = {
		query: __( 'Query' ),
		updated: __( 'Updated' ),
		status: __( 'Status' ),
		type: __( 'Type' ),
		comp_count: __( 'Competitors in top 10' ),
		comp_position: __( 'Competitor position' ),
		comp_url_name: __( 'Competitor URL' ),
		my_position: __( 'My Position' ),
		my_clicks: __( 'My clicks' ),
		my_impressions: __( 'My impressions' ),
		my_ctr: __( 'My CTR' ),
		my_url_name: __( 'My URL' ),
		labels: __( 'Tags' ),
	};

	const rowEditorCells = {
		query: <TextArea autoFocus liveUpdate defaultValue="" label={ __( 'Queries' ) } rows={ 10 } allowResize onChange={ ( val ) => setRowToEdit( { ...rowToEdit, query: val } ) } required description={ __( 'Each query must be on a separate line' ) } />,
		labels: <TagsMenu hasActivator label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
		useTableStore.setState( () => (
			{
				title,
				paginationId,
				slug,
				header,
				id: 'query',
				sorting: defaultSorting,
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
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ ( ) => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
			} } />,
			enableResizing: false,
		} ),
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 175,
		} ),
		columnHelper.accessor( 'type', {
			filterValMenu: types,
			className: 'nolimit',
			cell: ( cell ) => types[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'status', {
			filterValMenu: statuses,
			className: 'nolimit',
			cell: ( cell ) => statuses[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 40,
		} ),
		columnHelper.accessor( 'updated', {
			className: 'nolimit',
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 60,
		} ),
		columnHelper.accessor( 'comp_count', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'comp_position', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'comp_url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_position', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'my_impressions', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'my_clicks', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'my_ctr', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'my_url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 100,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell, id: 'query' } ) }
			>
				<Button onClick={ () => {
					setOptions( { queryDetailPanel: { query: cell.row.original.query, slug: cell.row.original.query.replace( ' ', '-' ) } } );
					activatePanel( 'queryDetailPanel' );
				} }
						className="mr-s small active">{ __( 'Show detail' ) }</Button>
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
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { updated: false, status: false, type: false, my_clicks: false, my_impressions: false, my_ctr: false, labels: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }>
				<TooltipSortingFiltering />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
