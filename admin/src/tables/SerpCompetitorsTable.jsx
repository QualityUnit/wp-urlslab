/* eslint-disable indent */
import { useI18n } from '@wordpress/react-i18n';

import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Loader,
	Tooltip,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function SerpCompetitorsTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Competitors' );
	const paginationId = 'domain_id';
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const defaultSorting = sorting.length ? sorting : [ { key: 'coverage', dir: 'DESC', op: '<' } ];
	const url = { filters, sorting: defaultSorting };

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, filters, sorting: defaultSorting, paginationId } );

	const header = {
		domain_name: __( 'Domain' ),
		cnt_top10_intersections: __( 'Top 10 intersections' ),
		cnt_top100_intersections: __( 'Top 100 intersections' ),
		avg_position: __( 'Avg. position' ),
		coverage: __( 'Coverage (%)' ),
	};

	const columns = [
		columnHelper.accessor( 'domain_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer"><strong>{ cell.getValue() }</strong></a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.domain_name }</SortBy>,
			minSize: 200,
		} ),
		columnHelper.accessor( 'avg_position', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.avg_position }</SortBy>,
			minSize: 50,
		} ),
		columnHelper.accessor( 'coverage', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.coverage }</SortBy>,
			minSize: 50,
		} ),
		columnHelper.accessor( 'cnt_top10_intersections', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting: defaultSorting, th, onClick: () => sortBy( th ) } }>{ header.cnt_top10_intersections }</SortBy>,
			minSize: 50,
		} ),
		columnHelper.accessor( 'cnt_top100_intersections', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.cnt_top100_intersections }</SortBy>,
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
				noDelete
				noInsert
				noCount
				noImport
				options={ { header, data, slug, paginationId, title, url, id: 'domain_name' }
				}
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				initialState={ { columnVisibility: { cnt_top100_intersections: false } } }
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
