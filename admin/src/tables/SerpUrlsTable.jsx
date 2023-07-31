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
	SingleSelectMenu, InputField, Editor, LangMenu, TagsMenu,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import React, { useCallback } from 'react';
import TextArea from '../elements/Textarea';

export default function SerpUrlsTable( { slug } ) {
	const paginationId = 'url_id';
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const defaultSorting = sorting.length ? sorting : [ { key: 'top10_queries_cnt', dir: 'DESC', op: '<' } ];
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

	const { selectRows, deleteRow, deleteMultipleRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const { activatePanel, setRowToEdit, setOptions } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell, id: 'url_name' } );
	}, [ setOptions, setRowToEdit, slug, updateRow ] );

	const domainTypes = {
		X: __( 'Other' ),
		M: __( 'My Domain' ),
		C: __( 'Competitor' ),
	};

	const header = {
		url_name: __( 'URL' ),
		url_title: __( 'Title' ),
		url_description: __( 'Description' ),
		domain_type: __( 'Domain Type' ),
		best_position: __( 'Best Position' ),
		top10_queries_cnt: __( 'Top 10' ),
		queries_cnt: __( 'Top 100' ),
		queries: __( 'Top Queries' ),
	};

	const columns = [
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer"><strong>{ cell.getValue() }</strong></a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_name }</SortBy>,
			minSize: 200,
		} ),
		columnHelper.accessor( 'url_title', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_title }</SortBy>,
			minSize: 100,
		} ),
		columnHelper.accessor( 'url_description', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_description }</SortBy>,
			minSize: 100,
		} ),
		columnHelper.accessor( 'domain_type', {
			filterValMenu: domainTypes,
			className: 'nolimit',
			cell: ( cell ) => domainTypes[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.domain_type }</SortBy>,
			size: 80,
		} ),

		columnHelper.accessor( 'best_position', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting: defaultSorting, th, onClick: () => sortBy( th ) } }>{ header.best_position }</SortBy>,
			minSize: 50,
		} ),
		columnHelper.accessor( 'top10_queries_cnt', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy props={ { header, sorting: defaultSorting, th, onClick: () => sortBy( th ) } }>{ header.top10_queries_cnt }</SortBy>,
			minSize: 50,
		} ),
		columnHelper.accessor( 'queries_cnt', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy props={ { header, sorting: defaultSorting, th, onClick: () => sortBy( th ) } }>{ header.queries_cnt }</SortBy>,
			minSize: 50,
		} ),
		columnHelper.accessor( 'queries', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy props={ { header, sorting: defaultSorting, th, onClick: () => sortBy( th ) } }>{ header.queries }</SortBy>,
			minSize: 200,
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
				noDelete
				noInsert
				noImport
				options={ { header, data, slug, paginationId, url, id: 'url_name', title: '', rowToEdit,
					deleteCSVCols: [ paginationId, 'url_id' ] }
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
