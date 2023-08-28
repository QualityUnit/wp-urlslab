/* eslint-disable indent */
import { useEffect } from 'react';
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

import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';

export default function SerpCompetitorsTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Competitors' );
	const paginationId = 'domain_id';
	const defaultSorting = [ { key: 'coverage', dir: 'DESC', op: '<' } ];

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { resetPanelsStore } = useTablePanels();
	const { resetTableStore } = useTableStore();

	const header = {
		domain_name: __( 'Domain' ),
		cnt_top10_intersections: __( 'Top 10 intersections' ),
		cnt_top100_intersections: __( 'Top 100 intersections' ),
		avg_position: __( 'Avg. position' ),
		coverage: __( 'Coverage (%)' ),
	};

	// Saving all variables into state managers
	useEffect( () => {
		resetPanelsStore();
		resetTableStore();

		useTableStore.setState( () => (
			{
				data,
				title,
				paginationId,
				slug,
				header,
				id: 'domain_name',
				sorting: defaultSorting,
			}
		) );

		useTablePanels.setState( () => (
			{
				deleteCSVCols: [ paginationId ],
			}
		) );
	}, [ data ] );

	const columns = [
		columnHelper.accessor( 'domain_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer"><strong>{ cell.getValue() }</strong></a>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),
		columnHelper.accessor( 'avg_position', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'coverage', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'cnt_top10_intersections', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'cnt_top100_intersections', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				noDelete
				noInsert
				noCount
				noImport
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { cnt_top100_intersections: false } } }
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
