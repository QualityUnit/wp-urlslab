/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { memo, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';

import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';
import { urlHeaders } from '../lib/serpUrlColumns';
import { getTooltipList } from '../lib/elementsHelpers';
import { SingleSelectMenu, SortBy, TooltipSortingFiltering, useInfiniteFetch } from '../lib/tableImports';

import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import DescriptionBox from '../elements/DescriptionBox';
import TableFilters from '../components/TableFilters';
import ExportPanel from '../components/ExportPanel';
import TableToolbar from '../components/TableToolbar';

const slug = 'serp-urls/url/similar-urls';
const defaultSorting = [ { key: 'cnt_queries', dir: 'DESC', op: '<' } ];
const customHeaders = {
	cnt_queries: __( 'Intersections', 'wp-urlslab' ),
};
const header = {
	...urlHeaders,
	...customHeaders,
};
const initialState = { columnVisibility: {
	url_title: false,
	url_description: false,
	country_value: false,
	top100_queries_cnt: false,
	top10_queries_cnt: false,
	country_volume: false,
	my_urls_ranked_top10: false,
	my_urls_ranked_top100: false,
} };

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit() {
	const setTable = useTableStore( ( state ) => state.setTable );
	const urlDetailPanel = useTableStore( ( state ) => state.urlDetailPanel );
	const [ init, setInit ] = useState( false );
	const { url } = urlDetailPanel;

	useEffect( () => {
		setInit( true );
		setTable( slug, {
			slug,
			header,
			paginationId: 'url_id',
			sorting: defaultSorting,
			fetchOptions: { // default fetch options used in initial query
				url,
				domain_type: 'A',
			},
		} );
	}, [ setTable, url ] );

	return init && <SerpUrlDetailSimilarUrlsTable />;
}

const SerpUrlDetailSimilarUrlsTable = memo( () => {
	const {
		columnHelper,
		data,
		isLoading,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const activePanel = useTablePanels( ( state ) => state.activePanel );

	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'cnt_queries', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'url_title', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper.accessor( 'url_description', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper.accessor( 'domain_type', {
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.domain_type.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'comp_intersections', {
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'best_position', {
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'top10_queries_cnt', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'top100_queries_cnt', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'top_queries', {
			tooltip: ( cell ) => getTooltipList( cell.getValue() ),
			cell: ( cell ) => cell.getValue().join( ', ' ),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),
		columnHelper.accessor( 'my_urls_ranked_top10', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'my_urls_ranked_top100', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_volume', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue() && cell.getValue() > 0 ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_value', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue() && cell.getValue() > 0 ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
	], [ columnHelper, columnTypes ] );

	return (
		<>
			<DescriptionBox
				title={ __( 'About this table', 'wp-urlslab' ) }
				tableSlug={ slug }
				sx={ { mb: 2 } }
			>
				{ __( 'Table shows list of URLs most similar to selected URL based on number of intersecting queries', 'wp-urlslab' ) }
			</DescriptionBox>

			<div className="urlslab-moduleView-headerBottom">
				<div className="flex flex-justify-space-between flex-align-center pb-s">
					<TableOptions />
					<TableFilters />
					<TableToolbar tableActions={ { noImport: true, noDelete: true } } />
				</div>
			</div>

			{ isLoading || isLoadingColumnTypes
				? <Loader />
				: <Table
					columns={ columns }
					initialState={ initialState }
					data={ isSuccess && tableData }
					referrer={ ref }
					loadingRows={ isFetchingNextPage }
					disableAddNewTableRecord
				>
					<TooltipSortingFiltering />
				</Table>
			}
			{ activePanel === 'export' &&
				<ExportPanel />
			}
		</>
	);
} );

const TableOptions = memo( () => {
	const fetchOptions = useTableStore().useFetchOptions();
	const setFetchOptions = useTableStore( ( state ) => state.setFetchOptions );

	return (
		<div className="flex flex-align-center mr-m">
			<SingleSelectMenu defaultAccept autoClose items={ {
				A: __( 'All URLs', 'wp-urlslab' ),
				M: __( 'My URLs', 'wp-urlslab' ),
				C: __( 'Competitor URLs', 'wp-urlslab' ),
			} } name="url_view_type" value={ fetchOptions.domain_type } onChange={ ( val ) => setFetchOptions( slug, { domain_type: val } ) } />
		</div>
	);
} );
