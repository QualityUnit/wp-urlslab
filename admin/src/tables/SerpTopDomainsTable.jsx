/* eslint-disable indent */
import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Loader,
	Tooltip,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	SingleSelectMenu,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import { useCallback } from 'react';

export default function SerpTopDomainsTable( { slug } ) {
	const paginationId = 'domain_id';
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const defaultSorting = sorting.length ? sorting : [ { key: 'top_10_cnt', dir: 'DESC', op: '<' } ];
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

	const domainTypes = {
		X: __('Other'),
		M: __('My Domain'),
		C: __('Competitor')
	};

	const header = {
		domain_name: __( 'Domain' ),
		domain_type: __( 'Type' ),
		top_10_cnt: __( 'Top 10 URLs' ),
		top_100_cnt: __( 'Top 100 URLs' ),
		avg_pos: __( 'Average Position' ),
	};

	const columns = [
		columnHelper.accessor( 'domain_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.domain_name }</SortBy>,
			minSize: 200,
		} ),

		columnHelper.accessor( 'domain_type', {
			filterValMenu: domainTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ domainTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.domain_type }</SortBy>,
			size: 80,
		} ),

		columnHelper.accessor( 'top_10_cnt', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting: defaultSorting, th, onClick: () => sortBy( th ) } }>{ header.top_10_cnt }</SortBy>,
			minSize: 50,
		} ),
		columnHelper.accessor( 'top_100_cnt', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.top_100_cnt }</SortBy>,
			minSize: 50,
		} ),
		columnHelper.accessor( 'avg_pos', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.avg_pos }</SortBy>,
			minSize: 50,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				table={ table }
				onFilter={ ( filter ) => setFilters( filter ) }
				noImport
				noDelete
				noInsert
				options={ { header, data, slug, paginationId, url, id: 'domain_name',
					deleteCSVCols: [ paginationId, 'domain_id' ] }
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
