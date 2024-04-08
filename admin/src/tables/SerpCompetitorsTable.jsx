/* eslint-disable indent */
import { useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';

import {
	useInfiniteFetch,
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

const title = __( 'Competitors' , 'wp-urlslab' );
const paginationId = 'domain_id';
const defaultSorting = [ { key: 'coverage', dir: 'DESC', op: '<' } ];
const header = {
	domain_name: __( 'Domain' , 'wp-urlslab' ),
	urls_cnt: __( 'Intersected URLs' , 'wp-urlslab' ),
	coverage: __( 'Coverage (%, 'wp-urlslab' )' ),
	top10_queries_cnt: __( 'Top 10 queries' , 'wp-urlslab' ),
	top100_queries_cnt: __( 'Top 100 queries' , 'wp-urlslab' ),
	country_value: __( 'Traffic Value' , 'wp-urlslab' ),
};
const initialState = { columnVisibility: { cnt_top100_intersections: false } };

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			title,
			paginationId,
			slug,
			header,
			id: 'domain_name',
			sorting: defaultSorting,
		} );
		useTablePanels.setState( () => ( {
			deleteCSVCols: [ paginationId ],
		} ) );
	}, [ setTable, slug ] );

	return init && <SerpCompetitorsTable slug={ slug } />;
}

function SerpCompetitorsTable( { slug } ) {
	const {
		columnHelper,
		data,
		isLoading,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const setTable = useTableStore( ( state ) => state.setTable );

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
			header: ( th ) => <SortBy { ...th } />,
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
		columnHelper.accessor( 'country_value', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
	], [ columnHelper ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox title={ __( 'About this table' , 'wp-urlslab' ) } tableSlug={ slug } isMainTableDescription >
				{ __( "Compare your domain with the domains of your competitors. First, assign a domain type to the domains under the Domains tab. Only URLs from each domain that overlap with specific queries from competitors are considered. We believe that only URLs ranking for the same queries as your competitors are relevant to each domain. A domain's coverage is the total number of URLs in the top ten rankings, divided by the number of queries in the top ten rankings for all URLs found in our database. Please note that only URLs discovered during SERP query processing are counted. The accuracy of your domain comparison data will improve as you authorize more queries for processing in your settings." , 'wp-urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom noDelete noInsert noImport />

			<Table
				className="fadeInto"
				initialState={ initialState }
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
				disableAddNewTableRecord
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
