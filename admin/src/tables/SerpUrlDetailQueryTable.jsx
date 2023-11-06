/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { memo, useCallback, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router-dom';

import { createColumnHelper } from '@tanstack/react-table';
import useTableStore from '../hooks/useTableStore';

import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import { getTooltipUrlsList } from '../lib/elementsHelpers';
import { RowActionButtons, SortBy, TooltipSortingFiltering, useInfiniteFetch } from '../lib/tableImports';
import Button from '@mui/joy/Button';
import ProgressBar from '../elements/ProgressBar';
import ColumnsMenu from '../elements/ColumnsMenu';
import Counter from '../components/RowCounter';
import DescriptionBox from '../elements/DescriptionBox';
import useSerpGapCompare from '../hooks/useSerpGapCompare';
import useTablePanels from '../hooks/useTablePanels';
import useAIGenerator from '../hooks/useAIGenerator';

import useModulesQuery from '../queries/useModulesQuery';
import { countriesList, countriesListForSelect } from '../api/fetchCountries';
import TableFilters from '../components/TableFilters';
import TableActionsMenu from '../elements/TableActionsMenu';
import ExportPanel from '../components/ExportPanel';
import RefreshTableButton from '../elements/RefreshTableButton';

const slug = 'serp-urls/url/queries';
const defaultSorting = [ { key: 'comp_intersections', dir: 'DESC', op: '<' } ];

const header = {
	query: __( 'Query' ),
	country: __( 'Country' ),
	position: __( 'Position' ),
	comp_intersections: __( 'Competitors' ),
	my_urls: __( 'My URLs' ),
	comp_urls: __( 'Comp. URLs' ),
	my_position: __( 'My best position' ),
	my_urls_ranked_top10: __( 'My URLs in Top 10' ),
	my_urls_ranked_top100: __( 'My URLs in Top 100' ),
	internal_links: __( 'Internal Links' ),
	country_volume: __( 'Volume' ),
	country_kd: __( 'Keyword Difficulty' ),
	country_level: __( 'Level' ),
	country_high_bid: __( 'High Bid' ),
	country_low_bid: __( 'Low Bid' ),
};

const kw_levels = {
	H: __( 'High' ),
	M: __( 'Medium' ),
	L: __( 'Low' ),
	'': __( '-' ),
};

function SerpUrlDetailQueryTable( { url } ) {
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const { setAIGeneratorConfig } = useAIGenerator();

	const { compareUrls } = useSerpGapCompare( 'query' );

	const handleCreateContent = useCallback( ( keyword ) => {
		if ( keyword ) {
			// setting the correct zustand state
			setAIGeneratorConfig( {
				keywordsList: [ { q: keyword, checked: true } ],
				serpUrlsList: [],
				dataSource: 'SERP_CONTEXT',
				selectedPromptTemplate: '4',
				title: keyword,
			} );
		}
	}, [ setAIGeneratorConfig ] );

	const customFetchOptions = { url };

	const { data: similarQueries, status, isSuccess: similarQueriesSuccess, isFetchingNextPage,
		hasNextPage, ref } = useInfiniteFetch( { slug, customFetchOptions, defaultSorting }, 20 );

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
						paginationId: 'query_id',
					},
				},
			}
		) );
	}, [ ] );

	const cols = useMemo( () => [
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'country', {
			filterValMenu: countriesListForSelect,
			cell: ( cell ) => <strong>{ countriesList[ cell.getValue() ] ? countriesList[ cell.getValue() ] : cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 130,
		} ),
		columnHelper.accessor( 'position', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 10,
		} ),
		columnHelper.accessor( 'comp_intersections', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } defaultSorting={ defaultSorting } />,
			size: 10,
		} ),
		columnHelper.accessor( 'my_urls', {
			tooltip: ( cell ) => <>
				{ getTooltipUrlsList( cell.getValue() ) }
				{ cell.getValue().length > 0 &&
					<Button
						size="xs"
						sx={ { mt: 1 } }
						onClick={ () => compareUrls( { cell, urlsArray: cell.getValue(), country: cell.row.original.country } ) }
					>
						{ __( 'Content Gap' ) }
					</Button>
				}
			</>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'comp_urls', {
			tooltip: ( cell ) => <>
				{ getTooltipUrlsList( cell.getValue() ) }
				{ cell.getValue().length > 0 &&
					<Button
						size="xs"
						sx={ { mt: 1 } }
						onClick={ () => compareUrls( { cell, urlsArray: cell.getValue(), country: cell.row.original.country } ) }
					>
						{ __( 'Content Gap' ) }
					</Button>
				}
			</>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_position', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 20,
		} ),
		columnHelper.accessor( 'my_urls_ranked_top10', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 20,
		} ),
		columnHelper.accessor( 'my_urls_ranked_top100', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 20,
		} ),
		columnHelper.accessor( 'internal_links', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 20,
		} ),
		columnHelper.accessor( 'country_volume', {
			className: 'nolimit',
			cell: ( cell ) => 'F' === cell.row.original.country_vol_status ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_kd', {
			className: 'nolimit',
			cell: ( cell ) => 'F' === cell.row.original.country_vol_status ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_level', {
			filterValMenu: kw_levels,
			className: 'nolimit',
			cell: ( cell ) => kw_levels[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_low_bid', {
			className: 'nolimit',
			cell: ( cell ) => 'F' === cell.row.original.country_vol_status ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_high_bid', {
			className: 'nolimit',
			cell: ( cell ) => 'F' === cell.row.original.country_vol_status ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),

		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => {
				const EditRowComponent = () => {
					// handle generator realted queries inside inner component to prevent unnecessary rerender of parent table component
					const { data: modules, isSuccess: isSuccessModules } = useModulesQuery();

					return (
						<RowActionButtons>
							{ isSuccessModules && modules.serp.active && ( cell?.row?.original?.my_urls?.length > 0 || cell?.row?.original?.comp_urls?.length > 0 ) && (
								<Button
									size="xxs"
									onClick={ () => compareUrls( { cell, urlsArray: [ ...cell.row.original.my_urls, ...cell.row.original.comp_urls ], country: cell.row.original.country } ) }
								>
									{ __( 'Content Gap' ) }
								</Button>
							) }
							{ isSuccessModules && modules[ 'urlslab-generator' ].active && (
								<Button
									component={ Link }
									size="xxs"
									to="/Generator/generator"
									onClick={ () => handleCreateContent( cell.row.original.query ) }
								>
									{ __( 'Create Content' ) }
								</Button>
							) }
							<Button
								component={ Link }
								size="xxs"
								to="/Serp/serp-queries"
								color="neutral"
								onClick={ () => {
									useTableStore.setState( { queryDetailPanel: { query: cell.row.original.query, country: cell.row.original.country, slug: cell.row.original.query?.replace( ' ', '-' ) } } );
								} }
								sx={ { mr: 1 } }
							>
								{ __( 'Show Detail' ) }
							</Button>
						</RowActionButtons>
					);
				};

				return <EditRowComponent />;
			},
			header: null,
			size: 0,
		} ),
	], [ columnHelper, compareUrls, handleCreateContent ] );

	return (
		<>
			<DescriptionBox
				title={ __( 'About this table' ) }
				tableSlug={ slug }
				sx={ { mb: 2 } }
			>
				{ __( 'Table shows list of queries, where selected URL ranks in top 100 based on loaded SERP data.' ) }
			</DescriptionBox>

			<div className="urlslab-moduleView-headerBottom">
				<div className="flex flex-justify-space-between flex-align-center">
					<TableFilters />
					<div className="ma-left flex flex-align-center">
						<TableActionsMenu options={ { noImport: true, noDelete: true } } />
						<Counter customFetchOptions={ customFetchOptions } className="ml-m mr-m" />
						<ColumnsMenu className="menu-left" />
						<RefreshTableButton defaultSorting={ defaultSorting } />
					</div>
				</div>
			</div>

			{ status === 'loading'
				? <Loader />
				: <div className="urlslab-panel-content">

					<div className="mt-l mb-l table-container">
						<Table
							initialState={ { columnVisibility: { country_level: false, country_kd: false, country_high_bid: false, country_low_bid: false } } }
							columns={ cols }
							data={ similarQueriesSuccess && similarQueries?.pages?.flatMap( ( page ) => page ?? [] ) }
							disableAddNewTableRecord
							defaultSorting={ defaultSorting }
							referer={ ref }
						>
							<TooltipSortingFiltering customFetchOptions={ customFetchOptions } />
							<>
								{ isFetchingNextPage ? '' : hasNextPage }
								<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
							</>
						</Table>
					</div>
				</div>
			}
			{ activePanel === 'export' &&
				<ExportPanel fetchOptions={ customFetchOptions } />
			}
		</>
	);
}

export default memo( SerpUrlDetailQueryTable );
