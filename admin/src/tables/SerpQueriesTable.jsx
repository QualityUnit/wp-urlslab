/* eslint-disable indent */
import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { Link } from 'react-router-dom';
import Button from '@mui/joy/Button';

import {
	useInfiniteFetch,
	ProgressBar,
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
	DateTimeFormat, InputField,
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

export default function SerpQueriesTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add Query' );
	const paginationId = 'query_id';
	const optionalSelector = 'country';

	const { setAIGeneratorConfig } = useAIGenerator();
	const defaultSorting = [ { key: 'comp_intersections', dir: 'DESC', op: '<' } ];

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { selectRows, deleteRow, updateRow } = useChangeRow();
	const { compareUrls } = useSerpGapCompare( 'query' );

	const { activatePanel, setOptions, setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const { data: modules, isSuccess: isSuccessModules } = useModulesQuery();

	const handleCreateContent = ( keyword ) => {
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
	};

	const ActionButton = ( { cell, onClick } ) => {
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
	};

	const statuses = {
		X: __( 'Not processed' ),
		P: __( 'Processing' ),
		A: __( 'Processed' ),
		E: __( 'Disabled' ),
		S: __( 'Irrelevant' ),
	};

	const types = {
		U: __( 'User Defined' ),
		C: __( 'Search Console' ),
		S: __( 'People also search for' ),
		F: __( 'People also ask' ),
	};

	const header = {
		query: __( 'Query' ),
		country: __( 'Country' ),
		type: __( 'Type' ),
		status: __( 'Status' ),
		updated: __( 'Updated' ),
		comp_intersections: __( 'Competitors in top 10' ),
		comp_urls: __( 'Competitor URLs' ),
		my_position: __( 'My Position' ),
		my_urls: __( 'My URLs' ),
		my_urls_ranked_top10: __( 'My URLs in Top10' ),
		my_urls_ranked_top100: __( 'My URLs in Top100' ),
		internal_links: __( 'Internal Links' ),
		labels: __( 'Tags' ),
	};

	const rowEditorCells = {
		query: <TextArea autoFocus liveUpdate defaultValue="" label={ __( 'Queries' ) } rows={ 10 } allowResize onChange={ ( val ) => setRowToEdit( { ...rowToEdit, query: val } ) } required description={ __( 'Each query must be on a separate line' ) } />,
		country: <InputField liveUpdate autoFocus type="text" defaultValue="" label={ header.country } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, country: val } ) } />,
		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId, optionalSelector ],
			}
		) );
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
						header,
						id: 'query',
						sorting: defaultSorting,
					},
				},
			}
		) );
	}, [ slug ] );

	//Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: { ...useTableStore.getState().tables, [ slug ]: { ...useTableStore.getState().tables[ slug ], data } },
			}
		) );
	}, [ data ] );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ ( ) => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
			} } />,
			enableResizing: false,
		} ),
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => cell.getValue(),
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
			cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item"
								onClick={ () => {
									setOptions( { queryDetailPanel: { query: cell.row.original.query, country: cell.row.original.country, slug: cell.row.original.query.replace( ' ', '-' ) } } );
									activatePanel( 'queryDetailPanel' );
								} }>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 175,
		} ),
		columnHelper.accessor( 'country', {
			filterValMenu: countriesListForSelect,
			tooltip: ( cell ) => countriesList[ cell.getValue() ] ? countriesList[ cell.getValue() ] : cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'type', {
			filterValMenu: types,
			className: 'nolimit',
			tooltip: ( cell ) => types[ cell.getValue() ],
			cell: ( cell ) => types[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'status', {
			filterValMenu: statuses,
			className: 'nolimit',
			cell: ( cell ) => statuses[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'updated', {
			className: 'nolimit',
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 140,
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
						onClick={ () => compareUrls( cell, cell.getValue() ) }
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
						onClick={ () => compareUrls( cell, cell.getValue() ) }
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
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 100,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell, id: 'query' } ) }
			>
				{ isSuccessModules && modules[ 'serp' ].active && (cell?.row?.original?.my_urls?.length > 0 || cell?.row?.original?.comp_urls?.length > 0) && (
					<Button
						size="xxs"
						onClick={ () => compareUrls( cell, [...cell.row.original.my_urls, ...cell.row.original.comp_urls] ) }
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
							setOptions( { queryDetailPanel: { query: cell.row.original.query, country: cell.row.original.country, slug: cell.row.original.query?.replace( ' ', '-' ) } } );
							activatePanel( 'queryDetailPanel' );
						} }
					sx={ { mr: 1 } }
				>
					{ __( 'Show Detail' ) }
				</Button>
				<ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'status', newVal: val, cell } ) } />
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The table displays a list of Search Engine Results Page (SERP) queries. These queries can be manually defined by you, imported from the Google Search Console, or automatically discovered through a function found in the Settings tab. Each query is accompanied by its processing status and the method through which it was identified. The SERP data updates are conducted in the background by the URLsLab service. However, due to the volume of queries, processing thousands of them can take several days. You have the ability to set the update frequency for each query within the Settings tab. For in-depth content analysis, frequent updates of queries are not crucial. Only SERP data associated with a 'Processed' status is stored. Other statuses indicate that the data has not been fetched yet. All requests to the URLsLab service are executed in the background by a cron task." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { updated: false, status: false, type: false, labels: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referer={ ref }
			>
				<TooltipSortingFiltering />
				<>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</>
			</Table>
		</>
	);
}
