import { memo, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { SingleSelectMenu, SortBy, TooltipSortingFiltering } from '../lib/tableImports';
import { renameModule } from '../lib/helpers';
import useTableStore from '../hooks/useTableStore';
import useInfiniteFetch from '../hooks/useInfiniteFetch';
import useTablePanels from '../hooks/useTablePanels';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import ColumnsMenu from '../elements/ColumnsMenu';
import Counter from '../components/RowCounter';
import TableFilters from '../components/TableFilters';
import TableActionsMenu from '../elements/TableActionsMenu';
import ExportPanel from '../components/ExportPanel';
import RefreshTableButton from '../elements/RefreshTableButton';
import InputField from '../elements/InputField';
import Button from '@mui/joy/Button';
import { urlHeaders } from '../lib/serpUrlColumns';
import { getTooltipList } from '../lib/elementsHelpers';

const customHeaders = {
	domain_name: __( 'Domain' ),
	cluster_level: __( 'Clustering Level' ),
	queries_cnt: __( 'Queries' ),
};

const header = {
	...urlHeaders,
	...customHeaders,
};

const slug = 'serp-queries/query/cluster-urls';
const defaultSorting = [ { key: 'cluster_level', dir: 'DESC', op: '<' } ];

function SerpQueryDetailClusterUrlsTable( ) {
	const queryDetailPanel = useTableStore( ( state ) => state.queryDetailPanel );
	const { query, country } = queryDetailPanel;
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const [ queryClusterData, setQueryClusterData ] = useState( { competitorCnt: 2, maxPos: 10 } );
	const [ tempQueryClusterData, setTempQueryClusterData ] = useState( { competitorCnt: 2, maxPos: 10 } );

	const { columnTypes } = useColumnTypesQuery( slug );

	const [ popupTableType, setPopupTableType ] = useState( 'A' );

	const customFetchOptions = { query, country, domain_type: popupTableType, max_position: queryClusterData.maxPos, competitors: queryClusterData.competitorCnt };

	const { data: topUrls, status, isSuccess: topUrlsSuccess, isFetchingNextPage, ref } = useInfiniteFetch( { slug, customFetchOptions, defaultSorting }, 20 );

	const activePanel = useTablePanels( ( state ) => state.activePanel );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						slug,
						header,
						paginationId: 'url_id',
					},
				},
			}
		) );
	}, [ ] );

	const topUrlsCol = useMemo( () => [
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

	], [ columnHelper, columnTypes?.domain_type.values ] );

	return (
		<>
			<div className="urlslab-moduleView-headerBottom">
				<div className="flex flex-align-center mb-m">
					<SingleSelectMenu defaultAccept autoClose key={ popupTableType } items={ {
						A: __( 'All URLs' ),
						M: __( 'My URLs' ),
						C: __( 'Competitor URLs' ),
					} } name="url_view_type" defaultValue={ popupTableType } onChange={ ( val ) => setPopupTableType( val ) } />

					<div className="ml-m">
						<InputField labelInline type="number" liveUpdate defaultValue={ queryClusterData.competitorCnt }
							label={ __( 'Clustering Level' ) } onChange={ ( val ) => setTempQueryClusterData( { ...queryClusterData, competitorCnt: val } ) } />
					</div>
					<div className="ml-m">
						<InputField labelInline type="number" liveUpdate defaultValue={ queryClusterData.maxPos }
							label={ __( 'Maximum Position' ) } onChange={ ( val ) => setTempQueryClusterData( { ...queryClusterData, maxPos: val } ) } />
					</div>
					<Button sx={ { ml: 1.5 } } onClick={ () => setQueryClusterData( tempQueryClusterData ) }>{ __( 'Update table' ) }</Button>
				</div>

				<div className="flex flex-justify-space-between flex-align-center pb-s">
					<TableFilters />

					<div className="ma-left flex flex-align-center">
						<TableActionsMenu options={ { noImport: true, noDelete: true } } className="mr-m" />
						<Counter customFetchOptions={ customFetchOptions } />
						<ColumnsMenu className="menu-left ml-m" />
						<RefreshTableButton defaultSorting={ defaultSorting } />
					</div>
				</div>
			</div>

			{ status === 'loading'
				? <Loader />
				: <>
					<Table
						columns={ topUrlsCol }
						data={ topUrlsSuccess && topUrls?.pages?.flatMap( ( page ) => page ?? [] ) }
						disableAddNewTableRecord
						defaultSorting={ defaultSorting }
						referrer={ ref }
						loadingRows={ isFetchingNextPage }
					>
						<TooltipSortingFiltering customFetchOptions={ customFetchOptions } />
					</Table>

					{ popupTableType === 'M' && topUrls?.length === 0 && <div className="urlslab-serpPanel-empty-table">
						<p>{ __( 'None of your pages are ranking for this keyword' ) }</p>
						<Link
							className="urlslab-button active"
							to={ '/' + renameModule( 'urlslab-generator' ) }
						>
							{ __( 'Create a Post' ) }
						</Link>
					</div>
					}
					{ popupTableType === 'C' && topUrls?.length === 0 && <div className="urlslab-serpPanel-empty-table">
						<p>{ __( 'None of your competitors are ranking for this keyword' ) }</p>
					</div>
					}
				</>
			}
			{ activePanel === 'export' &&
				<ExportPanel fetchOptions={ customFetchOptions } />
			}
		</>
	);
}

export default memo( SerpQueryDetailClusterUrlsTable );
