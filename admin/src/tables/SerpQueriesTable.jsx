import { memo, useCallback, useEffect, useMemo, lazy, Suspense, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router-dom';
import Button from '@mui/joy/Button';
import { queryTypes, queryStatuses, queryScheduleIntervals, queryHeaders, queryLevels, queryIntents } from "../lib/queryColumns";

import {
	useInfiniteFetch,
	SortBy,
	Checkbox,
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
	DateTimeFormat, SingleSelectMenu,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useSerpGapCompare from '../hooks/useSerpGapCompare';

import useModulesQuery from '../queries/useModulesQuery';
import useAIGenerator from '../hooks/useAIGenerator';
import { getTooltipUrlsList } from '../lib/elementsHelpers';
import DescriptionBox from '../elements/DescriptionBox';
import { countriesList, countriesListForSelect } from '../api/fetchCountries';
import CountrySelect from '../elements/CountrySelect';

const QueryDetailPanel = lazy( () => import( '../components/detailsPanel/QueryDetailPanel' ) );

const title = __( 'Add Query' );
const paginationId = 'query_id';
const optionalSelector = 'country';

const defaultSorting = [ { key: 'comp_intersections', dir: 'DESC', op: '<' } ];

export default function SerpQueriesTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug, defaultSorting } );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow( { defaultSorting } );
	const { compareUrls } = useSerpGapCompare( 'query' );

	const setActiveTable = useTableStore( ( state ) => state.setActiveTable );
	const queryDetailPanel = useTableStore( ( state ) => state.queryDetailPanel );
	const [ queryDetail, setQueryDetail ] = useState( false );

	const ActionButton = useMemo( () => ( { cell, onClick } ) => {
		const { status: serpStatus } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( serpStatus !== 'E' && serpStatus !== 'P' ) &&
					<Tooltip title={ __( 'Disable' ) }>
						<IconButton size="xs" color="danger" onClick={ () => onClick( 'E' ) }>
							<SvgIcon name="disable" />
						</IconButton>
					</Tooltip>
				}
				{
					( serpStatus !== 'P' ) &&
					<Tooltip title={ __( 'Process again' ) }>
						<IconButton size="xs" onClick={ () => onClick( 'X' ) }>
							<SvgIcon name="refresh" />
						</IconButton>
					</Tooltip>
				}
			</div>
		);
	}, [] );

	const handleBack = useCallback( () => {
		const cleanState = { ...useTableStore.getState() };
		delete cleanState.queryDetailPanel;
		useTableStore.setState( cleanState );
		setQueryDetail( false );
		setActiveTable( slug );
	}, [ setActiveTable, slug ] );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						title,
						paginationId,
						optionalSelector,
						slug,
						header: queryHeaders,
						id: 'query',
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

	useEffect( () => {
		if ( queryDetailPanel ) {
			setQueryDetail( true );
		}
	}, [ queryDetailPanel ] );

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ ( ) => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
			enableResizing: false,
		} ),
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => cell.getValue(),
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
			cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item"
				onClick={ () => {
					useTableStore.setState( { queryDetailPanel: { query: cell.row.original.query, country: cell.row.original.country, slug: cell.row.original.query.replace( ' ', '-' ) } } );
				} }>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 175,
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
			cell: ( cell ) => <SingleSelectMenu
				name={ cell.column.id }
				defaultValue={ cell.getValue() }
				items={ queryScheduleIntervals }
				onChange={ ( newVal ) => cell.getValue() !== newVal && updateRow( { newVal, cell } ) }
				className="table-hidden-input"
				defaultAccept
				autoClose
			/>,
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
									useTableStore.setState( { queryDetailPanel: { query: cell.row.original.query, country: cell.row.original.country, slug: cell.row.original.query?.replace( ' ', '-' ) } } );
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
	], [ columnHelper, isSelected, compareUrls, deleteRow, selectRows, slug, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		! queryDetail
			? <>
				<DescriptionBox title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
					{ __( 'The table displays a list of Search Engine Results Page (SERP) queries. These queries can be manually defined by you, imported from the Google Search Console, or automatically discovered through a function found in the Settings tab. Each query is accompanied by its processing status and the method used for its identification. The SERP data updates are conducted in the background by the URLsLab Service. However, due to the volume of queries, processing thousands of them can take several days. You have the ability to set the update frequency for each query within the Settings tab. For in-depth content analysis, frequent updates of queries are not crucial. Only SERP data with a Processed status is stored. Other statuses indicate that the data has not yet been fetched. All requests to the URLsLab Service are executed in the background by a cron task.' ) }
				</DescriptionBox>
				<ModuleViewHeaderBottom />
				<Table className="fadeInto"
					initialState={ { columnVisibility: { updated: false, status: false, type: false, labels: false, schedule_interval: false, schedule: false, country_level: false, country_kd: false, country_high_bid: false, country_low_bid: false } } }
					columns={ columns }
					data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
					defaultSorting={ defaultSorting }
					referrer={ ref }
					loadingRows={ isFetchingNextPage }
				>
					<TooltipSortingFiltering />
				</Table>
				<TableEditorManager slug={ slug } />
			</>
			: <Suspense>
				<QueryDetailPanel handleBack={ () => {
					handleBack();
				} } />
			</Suspense>
	);
}

const TableEditorManager = memo( ( slug ) => {
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const rowEditorCells = useMemo( () => ( {
		query: <TextArea autoFocus liveUpdate defaultValue="" label={ __( 'Queries' ) } rows={ 10 } allowResize onChange={ ( val ) => setRowToEdit( { query: val } ) } required description={ __( 'Each query must be on a separate line' ) } />,
		country: <CountrySelect label={ queryHeaders.country } value={ rowToEdit.country ? rowToEdit.country : 'us' } onChange={ ( val ) => setRowToEdit( { country: val } ) } />,
		schedule_interval: <SingleSelectMenu liveUpdate autoClose defaultAccept description={ __( 'Select how often should be SERP data updated. Each query update costs small fee. System defauld value can be changed in Settings of SERP module.' ) } defaultValue="" onChange={ ( val ) => setRowToEdit( { schedule_interval: val } ) } items={ queryScheduleIntervals }>{ queryHeaders.schedule_interval }</SingleSelectMenu>,
		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,
	} ), [ rowToEdit.country, setRowToEdit, slug ] );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ paginationId, optionalSelector ],
			}
		) );
	}, [ rowEditorCells ] );
} );
