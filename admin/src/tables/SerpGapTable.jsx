/* eslint-disable indent */
import {
	useInfiniteFetch, ProgressBar, SortBy, Checkbox, Trash, Loader, Tooltip, Table, ModuleViewHeaderBottom, TooltipSortingFiltering,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import IconButton from '../elements/IconButton';
import React, { useCallback } from 'react';
import TextArea from "../elements/Textarea";
import { ReactComponent as DisableIcon } from '../assets/images/icons/icon-disable.svg';
import { ReactComponent as RefreshIcon } from '../assets/images/icons/icon-refresh.svg';

export default function SerpGapTable( { slug } ) {
	const paginationId = 'query_id';
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );

	const defaultSorting = sorting.length ? sorting : [ { key: 'competitors_count', dir: 'DESC', op: '<' } ];
	const url = { filters, sorting: defaultSorting };

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
	} = useInfiniteFetch( { key: slug, filters, sorting: defaultSorting, paginationId } );

	const { selectRows, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const { activatePanel, setRowToEdit, setOptions } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell, id: 'keyword' } );
	}, [ setOptions, setRowToEdit, slug, updateRow ] );



	const ActionButton = ( { cell, onClick } ) => {
		const { status } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( status !== 'E' && status !== 'P' ) &&
					<IconButton className="mr-s c-saturated-red" tooltip={ __( 'Disable' ) } tooltipClass="align-left" onClick={ () => onClick( 'E' ) }>
						<DisableIcon />
					</IconButton>
				}
				{
					( status !== 'P' ) &&
					<IconButton className="mr-s" tooltip={ __( 'Process again' ) } tooltipClass="align-left" onClick={ () => onClick( 'X' ) }>
						<RefreshIcon />
					</IconButton>
				}
			</div>
		);
	};

	const header = {
		query: __( 'Query' ),
		type: __( 'Query Type' ),
		competitors_count: __( 'Competitors Intersection' ),
		top_competitors: __( 'Top Competitors' ),
		my_url_name: __( 'My URL' ),
		my_position: __( 'My Position' ),
		my_clicks: __( 'My Clicks' ),
		my_impressions: __( 'My Impressions' ),
		my_ctr: __( 'My CTR' ),
	};

	const types = {
		U: __( 'User' ),
		C: __( 'Search Console' ),
		S: __( 'Google Suggestion' ),
		F: __( 'Google FAQ' ),
	}

	const columns = [
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.query }</SortBy>,
			minSize: 200,
		} ),
		columnHelper.accessor( 'type', {
			filterValMenu: types,
			className: 'nolimit',
			cell: ( cell ) => types[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.type }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'competitors_count', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.competitors_count }</SortBy>,
			size: 30,
		} ),
		columnHelper.accessor( 'top_competitors', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.top_competitors }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'my_position', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.my_position }</SortBy>,
			size: 30,
		} ),
		columnHelper.accessor( 'my_clicks', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.my_clicks }</SortBy>,
			size: 30,
		} ),
		columnHelper.accessor( 'my_impressions', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.my_impressions }</SortBy>,
			size: 30,
		} ),
		columnHelper.accessor( 'my_ctr', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.my_ctr }</SortBy>,
			size: 30,
		} ),
		columnHelper.accessor( 'my_url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.my_url_name }</SortBy>,
			size: 100,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				table={ table }
				noDelete
				noAdd
				noImport
				onFilter={ ( filter ) => setFilters( filter ) }
				initialState={ { columnVisibility: { updated: false, status: false, type: false } } }
				options={ { header, data, slug, paginationId, url,
					title: __( 'Add Query' ), id: 'query',
					rowToEdit,
					deleteCSVCols: [ paginationId, 'dest_url_id' ] }
				}
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }>
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
