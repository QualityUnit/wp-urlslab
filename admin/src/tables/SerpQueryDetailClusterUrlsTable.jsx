import { memo, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router-dom';

import { SingleSelectMenu, SortBy, TooltipSortingFiltering } from '../lib/tableImports';
import { renameModule } from '../lib/helpers';
import { urlHeaders } from '../lib/serpUrlColumns';
import { getTooltipList } from '../lib/elementsHelpers';
import useTableStore from '../hooks/useTableStore';
import useInfiniteFetch from '../hooks/useInfiniteFetch';
import useTablePanels from '../hooks/useTablePanels';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

import InputField from '../elements/InputField';
import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import TableFilters from '../components/TableFilters';
import ExportPanel from '../components/ExportPanel';
import TableToolbar from '../components/TableToolbar';

import Button from '@mui/joy/Button';

const customHeaders = {
	domain_name: __( 'Domain', 'wp-urlslab' ),
	cluster_level: __( 'Clustering Level', 'wp-urlslab' ),
	queries_cnt: __( 'Queries', 'wp-urlslab' ),
};

const header = {
	...urlHeaders,
	...customHeaders,
};

const slug = 'serp-queries/query/cluster-urls';
const defaultSorting = [ { key: 'cluster_level', dir: 'DESC', op: '<' } ];

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit() {
	const setTable = useTableStore( ( state ) => state.setTable );
	const queryDetailPanel = useTableStore( ( state ) => state.queryDetailPanel );
	const [ init, setInit ] = useState( false );
	const { query, country } = queryDetailPanel;

	useEffect( () => {
		setInit( true );
		setTable( slug, {
			slug,
			header,
			paginationId: 'url_id',
			sorting: defaultSorting,
			fetchOptions: { // default fetch options used in initial query
				query,
				country,
				domain_type: 'A',
				max_position: 10,
				competitors: 2,
			},
		} );
	}, [ country, query, setTable ] );

	return init && <SerpQueryDetailClusterUrlsTable />;
}

const SerpQueryDetailClusterUrlsTable = memo( () => {
	const {
		columnHelper,
		data,
		isLoading,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const fetchOptions = useTableStore().useFetchOptions();
	const activePanel = useTablePanels( ( state ) => state.activePanel );

	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <Link to={ cell.getValue() } target="_blank">{ cell.getValue() }</Link>,
			header: ( th ) => <SortBy { ...th } />,
			size: 250,
		} ),
		columnHelper.accessor( 'domain_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <Link to={ cell.getValue() } target="_blank">{ cell.getValue() }</Link>,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'domain_type', {
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.domain_type.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'cluster_level', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'queries_cnt', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
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
			<div className="urlslab-moduleView-headerBottom">

				<TableOptions />

				<div className="flex flex-justify-space-between flex-align-center pb-s">
					<TableFilters />
					<TableToolbar tableActions={ { noImport: true, noDelete: true } } />
				</div>
			</div>

			{ isLoading || isLoadingColumnTypes
				? <Loader />
				: <>
					<Table
						columns={ columns }
						data={ isSuccess && tableData }
						referrer={ ref }
						loadingRows={ isFetchingNextPage }
						disableAddNewTableRecord
					>
						<TooltipSortingFiltering />
					</Table>

					{ ( fetchOptions.domain_type === 'M' && data?.length === 0 ) &&
						<div className="urlslab-serpPanel-empty-table">
							<p>{ __( 'None of your pages are ranking for this keyword', 'wp-urlslab' ) }</p>
							<Link
								className="urlslab-button active"
								to={ '/' + renameModule( 'urlslab-generator' ) }
							>
								{ __( 'Create a Post', 'wp-urlslab' ) }
							</Link>
						</div>
					}
					{ ( fetchOptions.domain_type === 'C' && data?.length === 0 ) &&
						<div className="urlslab-serpPanel-empty-table">
							<p>{ __( 'None of your competitors are ranking for this keyword', 'wp-urlslab' ) }</p>
						</div>
					}
				</>
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

	const [ tempQueryClusterData, setTempQueryClusterData ] = useState( { competitorCnt: fetchOptions.competitors, maxPos: fetchOptions.max_position } );

	return (
		<div className="flex flex-align-center mb-m">
			<SingleSelectMenu defaultAccept autoClose items={ {
				A: __( 'All URLs', 'wp-urlslab' ),
				M: __( 'My URLs', 'wp-urlslab' ),
				C: __( 'Competitor URLs', 'wp-urlslab' ),
			} } name="url_view_type" value={ fetchOptions.domain_type } onChange={ ( val ) => setFetchOptions( slug, { domain_type: val } ) } />

			<div className="ml-m">
				<InputField labelInline type="number" liveUpdate defaultValue={ tempQueryClusterData.competitorCnt }
					label={ __( 'Clustering Level', 'wp-urlslab' ) } onChange={ ( val ) => setTempQueryClusterData( ( s ) => ( { ...s, competitorCnt: val } ) ) } />
			</div>
			<div className="ml-m">
				<InputField labelInline type="number" liveUpdate defaultValue={ tempQueryClusterData.maxPos }
					label={ __( 'Maximum Position', 'wp-urlslab' ) } onChange={ ( val ) => setTempQueryClusterData( ( s ) => ( { ...s, maxPos: val } ) ) } />
			</div>
			<Button
				sx={ { ml: 1.5 } }
				onClick={ () => {
					setFetchOptions( slug, {
						max_position: tempQueryClusterData.maxPos,
						competitors: tempQueryClusterData.competitorCnt,
					} );
				} }
			>
				{ __( 'Update table', 'wp-urlslab' ) }
			</Button>
		</div>
	);
} );
