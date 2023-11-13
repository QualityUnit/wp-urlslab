/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { __ } from '@wordpress/i18n';

import { createColumnHelper } from '@tanstack/react-table';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import useSerpGapCompare from '../hooks/useSerpGapCompare';

import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import InputField from '../elements/InputField';
import { getTooltipUrlsList } from '../lib/elementsHelpers';
import {
	DateTimeFormat,
	RowActionButtons,
	SingleSelectMenu,
	SortBy, TagsMenu,
	TooltipSortingFiltering,
	useInfiniteFetch,
} from '../lib/tableImports';

import Button from '@mui/joy/Button';
import ColumnsMenu from '../elements/ColumnsMenu';
import Counter from '../components/RowCounter';
import DescriptionBox from '../elements/DescriptionBox';
import TableFilters from '../components/TableFilters';
import useModulesQuery from '../queries/useModulesQuery';
import TableActionsMenu from '../elements/TableActionsMenu';
import ExportPanel from '../components/ExportPanel';
import RefreshTableButton from '../elements/RefreshTableButton';
import { queryTypes, queryStatuses, queryScheduleIntervals, queryHeaders, queryLevels, queryIntents } from '../lib/serpQueryColumns';
import { countriesList, countriesListForSelect } from '../api/fetchCountries';

const headerCustom = {
	competitors: __( 'Nr. Intersections' ),
	matching_urls: __( 'URL Intersections' ),
	my_min_pos: __( 'My best position' ),
};

const header = {
	...queryHeaders,
	...headerCustom,
};

const slug = 'serp-queries/query-cluster';
const defaultSorting = [ { key: 'competitors', dir: 'DESC', op: '<' } ];

function SerpQueryDetailQueryClusterTable( ) {
	const queryDetailPanel = useTableStore( ( state ) => state.queryDetailPanel );
	const { query, country } = queryDetailPanel;
	const columnHelper = useMemo( () => createColumnHelper(), [] );

	const { compareUrls } = useSerpGapCompare( 'query' );

	const [ queryClusterData, setQueryClusterData ] = useState( { competitorCnt: 2, maxPos: 10 } );
	const [ tempQueryClusterData, setTempQueryClusterData ] = useState( { competitorCnt: 2, maxPos: 10 } );

	const activePanel = useTablePanels( ( state ) => state.activePanel );
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );

	const handleSimKeyClick = useCallback( ( keyword, countryvar = country ) => {
		useTableStore.setState( { queryDetailPanel: { query: keyword, country: countryvar, slug: keyword.replace( ' ', '-' ) } } );
	}, [ country ] );

	const customFetchOptions = {
		query,
		country,
		max_position: queryClusterData.maxPos,
		competitors: queryClusterData.competitorCnt,
	};

	const { data: similarQueries, status, isSuccess: similarQueriesSuccess, isFetchingNextPage, ref } = useInfiniteFetch( { slug, customFetchOptions, defaultSorting } );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						slug,
						paginationId: 'query_id',
						header,
					},
				},
			}
		) );
	}, [] );

	const cols = useMemo( () => [
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item link-style"
				onClick={ () => handleSimKeyClick( cell.row.original.query, cell.row.original.country ) }>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'country', {
			filterValMenu: countriesListForSelect,
			cell: ( cell ) => <strong>{ countriesList[ cell.getValue() ] ? countriesList[ cell.getValue() ] : cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 130,
		} ),
		columnHelper.accessor( 'type', {
			filterValMenu: queryTypes,
			className: 'nolimit',
			tooltip: ( cell ) => queryTypes[ cell.getValue() ],
			cell: ( cell ) => queryTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'schedule_interval', {
			filterValMenu: queryScheduleIntervals,
			className: 'nolimit',
			cell: ( cell ) => queryScheduleIntervals[ cell.getValue() ] ? queryScheduleIntervals[ cell.getValue() ] : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'status', {
			filterValMenu: queryStatuses,
			className: 'nolimit',
			cell: ( cell ) => queryStatuses[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'updated', {
			className: 'nolimit',
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 40,
		} ),
		columnHelper.accessor( 'schedule', {
			className: 'nolimit',
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 40,
		} ),
		columnHelper.accessor( 'comp_intersections', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } defaultSorting={ defaultSorting } />,
			size: 30,
		} ),
		columnHelper.accessor( 'matching_urls', {
			tooltip: ( cell ) => <>
				{ getTooltipUrlsList( cell.getValue() ) }
				{ cell.getValue().length > 0 &&
					<Button
						size="xs"
						sx={ { mt: 1 } }
						onClick={ () => compareUrls( { cell, country, urlsArray: cell.getValue() } ) }
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
						onClick={ () => compareUrls( { cell, country, urlsArray: cell.getValue() } ) }
					>
						{ __( 'Content Gap' ) }
					</Button>
				}
			</>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_urls', {
			tooltip: ( cell ) => <>
				{ getTooltipUrlsList( cell.getValue() ) }
				{ cell.getValue().length > 0 &&
					<Button
						size="xs"
						sx={ { mt: 1 } }
						onClick={ () => compareUrls( { cell, country, urlsArray: cell.getValue() } ) }
					>
						{ __( 'Content Gap' ) }
					</Button>
				}
			</>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_min_pos', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 20,
		} ),
		columnHelper.accessor( 'competitors', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } defaultSorting={ defaultSorting } />,
			size: 20,
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
		columnHelper.accessor( 'internal_links', {
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
		columnHelper.accessor( 'country_kd', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue() && cell.getValue() > 0 ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_level', {
			filterValMenu: queryLevels,
			className: 'nolimit',
			cell: ( cell ) => queryLevels[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'intent', {
			filterValMenu: queryIntents,
			className: 'nolimit',
			cell: ( cell ) => queryIntents[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_low_bid', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue() && cell.getValue() > 0 ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_high_bid', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue() && cell.getValue() > 0 ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: queryHeaders.labels,
			size: 100,
		} ),

		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => {
				const EditRowComponent = () => {
					// handle generator realted queries inside inner component to prevent unnecessary rerender of parent table component
					const { data: modules, isSuccess: isSuccessModules } = useModulesQuery();

					return (
						<RowActionButtons>
							{ isSuccessModules && modules.serp.active && ( cell?.row?.original?.my_urls?.length > 0 || cell?.row?.original?.comp_urls?.length > 0 || cell?.row?.original?.matching_urls?.length > 0 ) && (
								<Button
									size="xxs"
									onClick={ () => compareUrls( { cell, country, urlsArray: [ ...cell.row.original.my_urls, ...cell.row.original.comp_urls, ...cell.row.original.matching_urls ] } ) }
								>
									{ __( 'Content Gap' ) }
								</Button>
							)
							}
							{
								<Button
									component={ Link }
									to="/KeywordsLinks/keyword"
									size="xxs"
									onClick={ () => {
										setRowToEdit( { keyword: cell?.row?.original?.query, urlLink: cell?.row?.original?.my_urls[ 0 ] } );
										activatePanel( 'rowInserter' );
									} }
									sx={ { mr: 1 } }
								>
									{ __( 'Create Link' ) }
								</Button>

							}
						</RowActionButtons>
					);
				};

				return <EditRowComponent />;
			},
			header: null,
			size: 0,
		} ),
	], [ activatePanel, columnHelper, compareUrls, country, handleSimKeyClick, setRowToEdit ] );

	return (
		<>
			<DescriptionBox
				title={ __( 'About this table' ) }
				tableSlug={ slug }
				sx={ { mb: 2 } }
			>
				{ __( 'It is list of similar queries identified by intersection of urls in top X results in Google search results. You can define your own intersection limits (e.g. min 3 urls from 10 or more strict 5 from 10). Basic idea behind the cluster is, that if Google ranked same urls for different keywords, those keywords are related and maybe you should cover all of them on single URL of your website.' ) }
			</DescriptionBox>

			<div className="urlslab-moduleView-headerBottom">
				<div className="flex flex-align-center mb-m">
					<div>
						<InputField labelInline type="number" liveUpdate defaultValue={ queryClusterData.competitorCnt }
							label={ __( 'Clustering Level' ) } onChange={ ( val ) => setTempQueryClusterData( { ...queryClusterData, competitorCnt: val } ) } />
					</div>
					<div>
						<InputField labelInline className="ml-s" type="number" liveUpdate defaultValue={ queryClusterData.maxPos }
							label={ __( 'Maximum Position' ) } onChange={ ( val ) => setTempQueryClusterData( { ...queryClusterData, maxPos: val } ) } />
					</div>
					<Button sx={ { ml: 1 } } onClick={ () => setQueryClusterData( tempQueryClusterData ) }>{ __( 'Update table' ) }</Button>
				</div>
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
				: <Table
					columns={ cols }
					initialState={ { columnVisibility: {
						country: false,
						type: false,
						status: false,
						updated: false,
						comp_urls: false,
						my_urls: false,
						my_urls_ranked_top10: false,
						my_urls_ranked_top100: false,
						internal_links: false,
						schedule_interval: false,
						schedule: false,
						labels: false,
						country_level: false,
						country_kd: false,
						country_high_bid: false,
						country_low_bid: false,
					} } }
					data={ similarQueriesSuccess && similarQueries?.pages?.flatMap( ( page ) => page ?? [] ) }
					disableAddNewTableRecord
					defaultSorting={ defaultSorting }
					referrer={ ref }
					loadingRows={ isFetchingNextPage }
				>
					<TooltipSortingFiltering customFetchOptions={ customFetchOptions } />
				</Table>
			}
			{ activePanel === 'export' &&
				<ExportPanel fetchOptions={ customFetchOptions } />
			}
		</>
	);
}

export default memo( SerpQueryDetailQueryClusterTable );
