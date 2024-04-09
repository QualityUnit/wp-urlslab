import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router-dom';

import { SingleSelectMenu, SortBy, TooltipSortingFiltering } from '../lib/tableImports';
import { renameModule } from '../lib/helpers';
import useAIGenerator from '../hooks/useAIGenerator';
import useTableStore from '../hooks/useTableStore';
import useInfiniteFetch from '../hooks/useInfiniteFetch';
import useTablePanels from '../hooks/useTablePanels';
import { urlHeaders } from '../lib/serpUrlColumns';
import { getTooltipList } from '../lib/elementsHelpers';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import TableFilters from '../components/TableFilters';
import ExportPanel from '../components/ExportPanel';
import TableToolbar from '../components/TableToolbar';

const customHeaders = {
	position: __( 'Position', 'urlslab' ),
};

const header = {
	...urlHeaders,
	...customHeaders,
};

const slug = 'serp-queries/query/top-urls';
const defaultSorting = [ { key: 'position', dir: 'ASC', op: '>' } ];
const initialState = { columnVisibility: { country_value: false, country_volume: false } };

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
			},
		} );
	}, [ country, query, setTable ] );

	return init && <SerpQueryDetailRankedUrlsTable />;
}

const SerpQueryDetailRankedUrlsTable = memo( () => {
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
	const queryDetailPanel = useTableStore( ( state ) => state.queryDetailPanel );
	const activePanel = useTablePanels( ( state ) => state.activePanel );

	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );
	const { setAIGeneratorConfig } = useAIGenerator();

	const { query } = queryDetailPanel;

	// action handling
	const handleCreatePost = useCallback( () => {
		// setting the correct zustand state
		setAIGeneratorConfig( {
			keywordsList: [ { q: query, checked: true } ],
			serpUrlsList: [],
			dataSource: 'SERP_CONTEXT',
			selectedPromptTemplate: '4',
			title: query,
		} );
	}, [ query, setAIGeneratorConfig ] );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'position', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 20,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <Link to={ cell.getValue() } target="_blank">{ cell.getValue() }</Link>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'domain_type', {
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.domain_type.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
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
						initialState={ initialState }
						data={ isSuccess && tableData }
						referrer={ ref }
						loadingRows={ isFetchingNextPage }
						disableAddNewTableRecord
					>
						<TooltipSortingFiltering />
					</Table>

					{ fetchOptions.domain_type === 'M' && data?.length === 0 &&
						<div className="urlslab-serpPanel-empty-table">
							<p>{ __( 'None of your pages are ranking for this keyword', 'urlslab' ) }</p>
							<Link
								className="urlslab-button active"
								to={ '/' + renameModule( 'urlslab-generator' ) }
								onClick={ handleCreatePost }
							>
								{ __( 'Create a Post', 'urlslab' ) }
							</Link>
						</div>
					}
					{ fetchOptions.domain_type === 'C' && data?.length === 0 &&
						<div className="urlslab-serpPanel-empty-table">
							<p>{ __( 'None of your competitors are ranking for this keyword', 'urlslab' ) }</p>
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

	return (
		<div className="flex flex-align-center mb-m">
			<SingleSelectMenu defaultAccept autoClose items={ {
				A: __( 'All URLs', 'urlslab' ),
				M: __( 'My URLs', 'urlslab' ),
				C: __( 'Competitor URLs', 'urlslab' ),
			} } name="url_view_type" value={ fetchOptions.domain_type } onChange={ ( val ) => setFetchOptions( slug, { domain_type: val } ) } />
		</div>
	);
} );
