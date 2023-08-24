/* eslint-disable indent */
import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Loader,
	Tooltip,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	TagsMenu,
} from '../lib/tableImports';

import { renameModule } from '../lib/helpers';
import { Link } from 'react-router-dom';
import useTableStore from '../hooks/useTableStore';
import useAIGenerator from '../hooks/useAIGenerator';
import useTablePanels from '../hooks/useTablePanels';
import useModulesQuery from '../queries/useModulesQuery';
import Button from '../elements/Button';
import useChangeRow from '../hooks/useChangeRow';

export default function SerpGapTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'query_id';
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const { data: modules, isSuccess: isSuccessModules } = useModulesQuery();
	const { activatePanel, setOptions } = useTablePanels();

	const defaultSorting = [ { key: 'competitors_count', dir: 'DESC', op: '<' } ];

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { updateRow } = useChangeRow();

	const handleCreateContent = ( keyword ) => {
		// setting the correct zustand state
		setAIGeneratorConfig( {
			...aiGeneratorConfig,
			keywordsList: [ { q: keyword, checked: true } ],
			serpUrlsList: [],
			dataSource: 'SERP_CONTEXT',
			selectedPromptTemplate: '4',
			title: keyword,
		} );
	};

	const header = {
		query: __( 'Query' ),
		create_content: __( '' ),
		type: __( 'Query Type' ),
		competitors_count: __( 'Competitors Intersection' ),
		top_competitors: __( 'Top Competitors' ),
		my_position: __( 'My Position' ),
		my_clicks: __( 'My Clicks' ),
		my_impressions: __( 'My Impressions' ),
		my_ctr: __( 'My CTR' ),
		my_url_name: __( 'My URL' ),
		labels: __( 'Tags' ),
	};

	const types = {
		U: __( 'User' ),
		C: __( 'Search Console' ),
		S: __( 'People also search for' ),
		F: __( 'People also ask' ),
	};

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
				title: undefined,
				paginationId,
				optionalSelector: undefined,
				slug,
				header,
				id: 'query',
				sorting: defaultSorting,
			}
		) );

		useTablePanels.setState( () => (
			{
				rowEditorCells: {},
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
	}, [ data ] );

	const columns = [
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),
		columnHelper.accessor( 'create_content', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => isSuccessModules && modules[ 'urlslab-generator' ].active && ( <Link
				onClick={ () => handleCreateContent( cell.row.original.query ) }
				to={ '/' + renameModule( 'urlslab-generator' ) }
				className="urlslab-button active small"
			>
				{ __( 'Create Content' ) }
			</Link> ),
			header: () => header.create_content,
			minSize: 40,
		} ),
		columnHelper.accessor( 'type', {
			filterValMenu: types,
			className: 'nolimit',
			cell: ( cell ) => types[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 100,
		} ),
		columnHelper.accessor( 'competitors_count', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'top_competitors', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_position', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'my_clicks', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'my_impressions', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'my_ctr', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'my_url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'create_content', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <Button onClick={ () => {
				setOptions( { queryDetailPanel: { query: cell.row.original.query, slug: cell.row.original.query.replace( ' ', '-' ) } } );
				activatePanel( 'queryDetailPanel' );
			} } className="small">{ __( 'Show Detail' ) }</Button>,
			header: () => header.create_content,
			minSize: 40,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				noDelete
				noInsert
				noImport
				/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { updated: false, status: false, type: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }>
				<TooltipSortingFiltering />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
