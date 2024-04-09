/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router-dom';

import useTableStore from '../hooks/useTableStore';

import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import { getTooltipUrlsList } from '../lib/elementsHelpers';
import {
	DateTimeFormat,
	RowActionButtons,
	SortBy, TagsMenu,
	TooltipSortingFiltering,
	useInfiniteFetch,
} from '../lib/tableImports';
import { countriesList } from '../api/fetchCountries';
import { queryHeaders } from '../lib/serpQueryColumns';
import DescriptionBox from '../elements/DescriptionBox';
import useSerpGapCompare from '../hooks/useSerpGapCompare';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useAIGenerator from '../hooks/useAIGenerator';

import useModulesQuery from '../queries/useModulesQuery';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

import TableFilters from '../components/TableFilters';
import ExportPanel from '../components/ExportPanel';
import TableToolbar from '../components/TableToolbar';

import Button from '@mui/joy/Button';

// source table data necessary for api requests, ie. during edit row
import { slug as sourceTableSlug, optionalSelector, paginationId } from './SerpQueriesTable';

const slug = 'serp-urls/url/queries';

const defaultSorting = [ { key: 'comp_intersections', dir: 'DESC', op: '<' } ];
const headerCustom = {
	position: __( 'Position', 'urlslab' ),
};
const header = {
	...headerCustom,
	...queryHeaders,
};
const initialState = { columnVisibility: {
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
	country_low_bid: false },
};
// slugs of queries which may be cached and needs to be invalidated after row update to show changed value
const relatedQueries = [ sourceTableSlug, 'serp-queries/query-cluster', 'serp-gap' ];

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
			sorting: defaultSorting,
			relatedQueries,
			fetchOptions: { // default fetch options used in initial query
				url,
			},
			// info about source table needed for api request
			sourceTableInfo: {
				slug: sourceTableSlug,
				optionalSelector,
				paginationId,
			},
		} );
	}, [ setTable, url ] );

	return init && <SerpUrlDetailQueryTable />;
}

const SerpUrlDetailQueryTable = memo( () => {
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
	const activePanel = useTablePanels( ( state ) => state.activePanel );

	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );
	const { setAIGeneratorConfig } = useAIGenerator();
	const { compareUrls } = useSerpGapCompare( 'query' );
	const { updateRow } = useChangeRow();

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

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'position', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 10,
		} ),
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'country', {
			cell: ( cell ) => <strong>{ countriesList[ cell.getValue() ] ? countriesList[ cell.getValue() ] : cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 130,
		} ),
		columnHelper.accessor( 'type', {
			className: 'nolimit',
			tooltip: ( cell ) => columnTypes?.type.values[ cell.getValue() ],
			cell: ( cell ) => columnTypes?.type.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'schedule_interval', {
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.schedule_interval.values[ cell.getValue() ] ? columnTypes?.schedule_interval.values[ cell.getValue() ] : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'status', {
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.status.values[ cell.getValue() ],
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
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
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
						{ __( 'Content Gap', 'urlslab' ) }
					</Button>
				}
			</>,
			cell: ( cell ) => cell.getValue().join( ', ' ),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_position', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
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
						{ __( 'Content Gap', 'urlslab' ) }
					</Button>
				}
			</>,
			cell: ( cell ) => cell.getValue().join( ', ' ),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
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
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.country_level.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'intent', {
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.intent.values[ cell.getValue() ],
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
			cell: ( cell ) => <TagsMenu value={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
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
							{ isSuccessModules && modules.serp.active && ( cell?.row?.original?.my_urls?.length > 0 || cell?.row?.original?.comp_urls?.length > 0 ) && (
								<Button
									size="xxs"
									onClick={ () => compareUrls( { cell, urlsArray: [ ...cell.row.original.my_urls, ...cell.row.original.comp_urls ], country: cell.row.original.country } ) }
								>
									{ __( 'Content Gap', 'urlslab' ) }
								</Button>
							) }
							{ isSuccessModules && modules[ 'urlslab-generator' ].active && (
								<Button
									component={ Link }
									size="xxs"
									to="/Generator/generator"
									onClick={ () => handleCreateContent( cell.row.original.query ) }
								>
									{ __( 'Create Content', 'urlslab' ) }
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
								{ __( 'Show Detail', 'urlslab' ) }
							</Button>
						</RowActionButtons>
					);
				};

				return <EditRowComponent />;
			},
			header: null,
			size: 0,
		} ),
	], [ columnHelper, columnTypes, compareUrls, handleCreateContent, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable ] );

	return (
		<>
			<DescriptionBox
				title={ __( 'About this table', 'urlslab' ) }
				tableSlug={ slug }
				sx={ { mb: 2 } }
			>
				{ __( 'Table shows list of queries, where selected URL ranks in top 100 based on loaded SERP data.', 'urlslab' ) }
			</DescriptionBox>

			<div className="urlslab-moduleView-headerBottom">
				<div className="flex flex-justify-space-between flex-align-center pb-s">
					<TableFilters />
					<TableToolbar tableActions={ { noImport: true, noDelete: true } } />
				</div>
			</div>

			{ isLoading || isLoadingColumnTypes
				? <Loader />
				: <Table
					initialState={ initialState }
					columns={ columns }
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

