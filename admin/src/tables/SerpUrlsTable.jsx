/* eslint-disable indent */
import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';

import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering, RowActionButtons,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';

import { getTooltipList } from '../lib/elementsHelpers';
import Button from '@mui/joy/Button';
import DescriptionBox from '../elements/DescriptionBox';

export default function SerpUrlsTable( { slug } ) {
	const { __ } = useI18n();
	const title = '';
	const paginationId = 'url_id';
	const defaultSorting = [ { key: 'top10_queries_cnt', dir: 'DESC', op: '<' } ];
	const { activatePanel, setOptions } = useTablePanels();
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const domainTypes = {
		X: __( 'Uncategorized' ),
		M: __( 'My Domain' ),
		C: __( 'Competitor' ),
		I: __( 'Ignored' ),
	};

	const header = {
		url_name: __( 'URL' ),
		url_title: __( 'Title' ),
		url_description: __( 'Description' ),
		domain_type: __( 'Domain type' ),
		comp_intersections: __( 'Competitors' ),
		best_position: __( 'Best position' ),
		top10_queries_cnt: __( 'Top 10' ),
		top100_queries_cnt: __( 'Top 100' ),
		top_queries: __( 'Top queries' ),
		my_urls_ranked_top10: __( 'My URLs in Top10' ),
		my_urls_ranked_top100: __( 'My URLs in Top100' ),
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				deleteCSVCols: [ paginationId, 'url_id' ],
			}
		) );
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						title,
						paginationId,
						slug,
						header,
						id: 'url_name',
						sorting: defaultSorting,
					},
				},
			}
		) );
	}, [ slug ] );

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: { ...useTableStore.getState().tables, [ slug ]: { ...useTableStore.getState().tables[ slug ], data } },
			}
		) );
	}, [ data, slug ] );

	const columns = [
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.getValue(),
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
			cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item" onClick={ () => {
				setOptions( { urlDetailPanel: { url: cell.row.original.url_name, slug } } );
				activatePanel( 'urlDetailPanel' );
			} }>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
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
		columnHelper.accessor( 'domain_type', {
			filterValMenu: domainTypes,
			className: 'nolimit',
			cell: ( cell ) => domainTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
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
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons>
				<Button
					size="xxs"
					color="neutral"
					onClick={ () => {
						setOptions( { urlDetailPanel: { url: cell.row.original.url_name, slug } } );
						activatePanel( 'urlDetailPanel' );
					} }
					sx={ { mr: 1 } }
				>
					{ __( 'Show Detail' ) }
				</Button>
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
				{ __( "The table displays URLs that are ranked among the top 100 results in SERP. Beside each URL, you have the option to examine the key queries associated with each URL and the number of competitor domains intersecting with it for the same keywords. The more your URL intersects with those of your competitors, the greater its potential significance to your business. This report also provides ideas derived from your competitors' websites on what a well-ranked page should look like. It can serve as a source of inspiration, helping you identify what type of content may be missing from your own website." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noDelete
				noInsert
				noImport
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { url_description: false, best_position: false, top100_queries_cnt: false } } }
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
