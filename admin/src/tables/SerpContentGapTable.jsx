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
	RowActionButtons,
	TagsMenu,
	DateTimeFormat, InputField, SingleSelectMenu,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';

import { ReactComponent as DisableIcon } from '../assets/images/icons/icon-disable.svg';
import { ReactComponent as RefreshIcon } from '../assets/images/icons/icon-refresh.svg';

import useModulesQuery from '../queries/useModulesQuery';
import useAIGenerator from '../hooks/useAIGenerator';
import { getTooltipUrlsList } from '../lib/elementsHelpers';
import ColumnsMenu from "../elements/ColumnsMenu";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import SerpQueryDetailSimQueryTable from "./SerpQueryDetailSimQueryTable";
import SerpQueryDetailTopUrlsTable from "./SerpQueryDetailTopUrlsTable";

export default function SerpContentGapTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add Query' );
	const paginationId = 'query_id';
	const optionalSelector = 'country';

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

	const { activatePanel, setOptions, setRowToEdit } = useTablePanels();
	const { data: modules, isSuccess: isSuccessModules } = useModulesQuery();


	const header = {
		query: __( 'Query' ),
		country: __( 'Country' ),
		comp_intersections: __( 'Competitors' ),
		internal_links: __( 'Internal Links' ),
		//TODO dynami columns based on selected domains or URLs
		position_0: __( 'Position 0' ),
		url_name_0: __( 'URL Name 0' ),
		position_1: __( 'Position 1' ),
		url_name_1: __( 'URL Name 1' ),
	};

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
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'comp_intersections', {
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


		//TODO dynamic columns based on selected domains or URLs
		columnHelper.accessor( 'position_0', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'url_name_0', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'position_1', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'url_name_1', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<div className="urlslab-serpPanel-title">
				<Tabs defaultValue="domains">
					<TabList tabFlex="auto">
						<Tab value="domains">{ __( 'Compare Domains' ) }</Tab>
						<Tab value="urls">{ __( 'Comapre URLs' ) }</Tab>
					</TabList>
					<TabPanel value="domains">
						<p>{ __( 'Compare multiple domains together and find out keywords intersecting between them.' ) }</p>
						<InputField labelInline liveUpdate label={ __( 'Domain 0' ) } onChange={ ( val ) => setGapData( { ...gapData, domain0: val } ) } />
						<InputField labelInline liveUpdate label={ __( 'Domain 1' ) } onChange={ ( val ) => setGapData( { ...gapData, domain1: val } ) } />
					</TabPanel>
					<TabPanel value="urls">
						<p>{ __( 'Compare multiple URLs together and find out keywords intersecting between them.' ) }</p>
						<InputField labelInline liveUpdate defaultValue="" label={ __( 'URL 0' ) } onChange={ ( val ) => setGapData( { ...gapData, url0: val } ) } />
						<InputField labelInline liveUpdate defaultValue="" label={ __( 'URL 1' ) } onChange={ ( val ) => setGapData( { ...gapData, url1: val } ) } />
					</TabPanel>
				</Tabs>
				<Tabs defaultValue="cluster">
					<TabList tabFlex="auto">
						<Tab value="cluster">{ __( 'Keyword cluster' ) }</Tab>
					</TabList>
					<TabPanel value="cluster">
						<h3>{ __( 'What is keyword cluster?' ) }</h3>
						<p>{ __( 'Cluster forms keywords discovered in your database, where the same URLs rank on Google Search for each query.' ) }</p>
						<p>{ __( 'Enter a main keyword of cluster to find the best matching keywords from the cluster. Leave query field empty to show full content gap analyses.' ) }</p>
						<InputField labelInline liveUpdate label={ __( 'Query' ) } onChange={ ( val ) => setGapData( { ...gapData, query: val } ) } />
						<InputField labelInline type="number" liveUpdate defaultValue={ 5 } label={ __( 'Clustering Level' ) } onChange={ ( val ) => setGapData( { ...gapData, matching_urls: val } ) } />
						<InputField labelInline type="number" liveUpdate defaultValue={ 10 } label={ __( 'Max position' ) } onChange={ ( val ) => setGapData( { ...gapData, max_position: val } ) } />
					</TabPanel>
				</Tabs>
			</div>

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
