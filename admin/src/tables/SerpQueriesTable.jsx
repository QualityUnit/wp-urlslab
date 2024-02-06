import { memo, useCallback, useEffect, useMemo, lazy, Suspense, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router-dom';
import Button from '@mui/joy/Button';

import {
	useInfiniteFetch,
	SortBy,
	Loader,
	Tooltip,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	TextArea,
	IconButton,
	SvgIcon,
	RowActionButtons,
	TagsMenu,
	DateTimeFormat, SingleSelectMenu, TableSelectCheckbox,
} from '../lib/tableImports';

import { queryHeaders } from '../lib/serpQueryColumns';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useSerpGapCompare from '../hooks/useSerpGapCompare';
import useAIGenerator from '../hooks/useAIGenerator';

import useModulesQuery from '../queries/useModulesQuery';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';
import { getTooltipUrlsList } from '../lib/elementsHelpers';
import DescriptionBox from '../elements/DescriptionBox';
import { countriesList } from '../api/fetchCountries';
import CountrySelect from '../elements/CountrySelect';

const QueryDetailPanel = lazy( () => import( '../components/detailsPanel/QueryDetailPanel' ) );

const title = __( 'Add Query' );
const paginationId = 'query_id';
const optionalSelector = 'country';

const defaultSorting = [ { key: 'comp_intersections', dir: 'DESC', op: '<' } ];
const initialState = { columnVisibility: { updated: false, status: false, type: false, labels: false, schedule_interval: false, schedule: false, country_level: false, country_kd: false, country_high_bid: false, country_low_bid: false, country_vol_status: false, country_last_updated: false } };

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			title,
			paginationId,
			optionalSelector,
			slug,
			header: queryHeaders,
			id: 'query',
			sorting: defaultSorting,
		} );
	}, [ setTable, slug ] );

	return init && <SerpQueriesTable slug={ slug } />;
}

function SerpQueriesTable( { slug } ) {
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
	const queryDetailPanel = useTableStore( ( state ) => state.queryDetailPanel );
	const setQueryDetailPanel = useTableStore( ( state ) => state.setQueryDetailPanel );

	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );
	const { deleteRow, updateRow } = useChangeRow();
	const { compareUrls } = useSerpGapCompare( 'query' );

	const ActionButton = useMemo( () => ( { cell, onClick } ) => {
		const { status: serpStatus } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{ ( serpStatus !== 'E' && serpStatus !== 'P' ) &&
					<Tooltip title={ __( 'Disable' ) } arrow placement="bottom">
						<IconButton size="xs" color="danger" onClick={ () => onClick( 'E' ) }>
							<SvgIcon name="disable" />
						</IconButton>
					</Tooltip>
				}
				{ ( serpStatus !== 'P' ) &&
					<Tooltip title={ __( 'Process again' ) } arrow placement="bottom">
						<IconButton size="xs" onClick={ () => onClick( 'X' ) }>
							<SvgIcon name="refresh" />
						</IconButton>
					</Tooltip>
				}
			</div>
		);
	}, [] );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => cell.getValue(),
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
			cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item"
				onClick={ () => {
					setQueryDetailPanel( { query: cell.row.original.query, country: cell.row.original.country, slug: cell.row.original.query.replace( ' ', '-' ) } );
				} }>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 175,
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
			cell: ( cell ) => <SingleSelectMenu
				name={ cell.column.id }
				value={ cell.getValue() }
				items={ columnTypes?.schedule_interval.values }
				onChange={ ( newVal ) => cell.getValue() !== newVal && updateRow( { newVal, cell } ) }
				className="table-hidden-input"
				defaultAccept
				autoClose
			/>,
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
		columnHelper.accessor( 'country_vol_status', {
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.country_vol_status.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_last_updated', {
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
						{ __( 'Content Gap' ) }
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
						{ __( 'Content Gap' ) }
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
					const { setAIGeneratorConfig } = useAIGenerator();

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

					return (
						<RowActionButtons
							onDelete={ () => deleteRow( { cell, id: 'query' } ) }
						>
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
								size="xxs"
								color="neutral"
								onClick={ () => {
									setQueryDetailPanel( { query: cell.row.original.query, country: cell.row.original.country, slug: cell.row.original.query?.replace( ' ', '-' ) } );
								} }
								sx={ { mr: 1 } }
							>
								{ __( 'Show Detail' ) }
							</Button>
							<ActionButton
								cell={ cell }
								onClick={ ( val ) => {
									if ( val === 'X' ) {
										updateRow( { updateMultipleData: true, newVal: { status: val, type: 'U' }, cell } );
										return false;
									}
									updateRow( { changeField: 'status', newVal: val, cell } );
								} }
							/>
						</RowActionButtons>
					);
				};

				return <EditRowComponent />;
			},
			header: null,
			size: 0,
		} ),
	], [ columnHelper, columnTypes, compareUrls, deleteRow, setQueryDetailPanel, slug, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading || isLoadingColumnTypes ) {
		return <Loader isFullscreen />;
	}

	return (
		! queryDetailPanel
			? <>
				<DescriptionBox title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
					{ __( 'The table displays a list of Search Engine Results Page (SERP) queries. These queries can be manually defined by you, imported from the Google Search Console, or automatically discovered through a function found in the Settings tab. Each query is accompanied by its processing status and the method used for its identification. The SERP data updates are conducted in the background by the URLsLab Service. However, due to the volume of queries, processing thousands of them can take several days. You have the ability to set the update frequency for each query within the Settings tab. For in-depth content analysis, frequent updates of queries are not crucial. Only SERP data with a Processed status is stored. Other statuses indicate that the data has not yet been fetched. All requests to the URLsLab Service are executed in the background by a cron task.' ) }
				</DescriptionBox>

				<ModuleViewHeaderBottom />

				<Table
					className="fadeInto"
					initialState={ initialState }
					columns={ columns }
					data={ isSuccess && tableData }
					referrer={ ref }
					loadingRows={ isFetchingNextPage }
				>
					<TooltipSortingFiltering />
				</Table>

				<TableEditorManager slug={ slug } />
			</>
			: <Suspense>
				<QueryDetailPanel sourceTableSlug={ slug } />
			</Suspense>
	);
}

const TableEditorManager = memo( ( { slug } ) => {
	const { columnTypes } = useColumnTypesQuery( slug );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const rowEditorCells = getQueriesTableEditorCells( { data: rowToEdit, onChange: setRowToEdit, slug, columnTypes } );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ paginationId ],
			}
		) );
	}, [ rowEditorCells ] );
} );

export const getQueriesTableEditorCells = ( { data, onChange, slug, columnTypes } ) => {
	return {
		query: <TextArea autoFocus liveUpdate defaultValue={ data.query ? data.query : '' } label={ __( 'Queries' ) } rows={ 10 } allowResize onChange={ ( val ) => onChange( { query: val } ) } required description={ __( 'Each query must be on a separate line' ) } />,
		country: <CountrySelect label={ queryHeaders.country } value={ data.country ? data.country : 'us' } onChange={ ( val ) => onChange( { country: val } ) } />,
		schedule_interval: <SingleSelectMenu liveUpdate autoClose defaultAccept defaultValue={ data.schedule_interval ? data.schedule_interval : '' } description={ __( 'Select how often should be SERP data updated. Each query update costs small fee. System defauld value can be changed in Settings of SERP module.' ) } onChange={ ( val ) => onChange( { schedule_interval: val } ) } items={ columnTypes?.schedule_interval.values }>{ queryHeaders.schedule_interval }</SingleSelectMenu>,
		labels: <TagsMenu optionItem defaultValue={ data.labels ? data.labels : '' } label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => onChange( { labels: val } ) } />,
	};
};
