/* eslint-disable indent */
import { useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n';

import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
} from '../lib/tableImports';
import { urlHasProtocol } from '../lib/helpers';

import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';

import DescriptionBox from '../elements/DescriptionBox';

const title = __( 'Competitors' );
const paginationId = 'domain_id';

const defaultSorting = [ { key: 'coverage', dir: 'DESC', op: '<' } ];

const header = {
	domain_name: __( 'Domain' ),
	urls_cnt: __( 'Intersected URLs' ),
	coverage: __( 'Coverage (%)' ),
	top10_queries_cnt: __( 'Top 10 queries' ),
	top100_queries_cnt: __( 'Top 100 queries' ),
};

export default function SerpCompetitorsTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug, defaultSorting } );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				deleteCSVCols: [ paginationId ],
			}
		) );
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						title,
						paginationId,
						slug,
						header,
						id: 'domain_name',
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
		columnHelper.accessor( 'domain_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ urlHasProtocol( cell.getValue() ) ? cell.getValue() : `http://${ cell.getValue() }` } target="_blank" rel="noreferrer"><strong>{ cell.getValue() }</strong></a>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),
		columnHelper.accessor( 'urls_cnt', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'coverage', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } defaultSorting={ defaultSorting } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'top10_queries_cnt', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'top100_queries_cnt', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
	], [ columnHelper ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription >
				{ __( "Compare your domain with the domains of your competitors. First, assign a domain type to the domains under the Domains tab. Only URLs from each domain that overlap with specific queries from competitors are considered. We believe that only URLs ranking for the same queries as your competitors are relevant to each domain. A domain's coverage is the total number of URLs in the top ten rankings, divided by the number of queries in the top ten rankings for all URLs found in our database. Please note that only URLs discovered during SERP query processing are counted. The accuracy of your domain comparison data will improve as you authorize more queries for processing in your settings." ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom
				noDelete
				noInsert
				noImport
			/>

			<Table className="fadeInto"
				initialState={ { columnVisibility: { cnt_top100_intersections: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				disableAddNewTableRecord
				defaultSorting={ defaultSorting }
				referer={ ref }
			>
				<TooltipSortingFiltering />
				<>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</>
			</Table>
		</>
	);
}
