import { useEffect, useMemo, lazy, Suspense } from 'react';
import { __ } from '@wordpress/i18n/';
import { urlHeaders } from '../lib/serpUrlColumns';

import {
	useInfiniteFetch,
	SortBy,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering, RowActionButtons,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

import { getTooltipList } from '../lib/elementsHelpers';
import Button from '@mui/joy/Button';
import DescriptionBox from '../elements/DescriptionBox';

const title = '';
const paginationId = 'url_id';

const defaultSorting = [];

const UrlDetailPanel = lazy( () => import( '../components/detailsPanel/UrlDetailPanel' ) );

export default function SerpUrlsTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug, defaultSorting } );

	const urlDetailPanel = useTableStore( ( state ) => state.urlDetailPanel );
	const setUrlDetailPanel = useTableStore( ( state ) => state.setUrlDetailPanel );

	const { columnTypes } = useColumnTypesQuery( slug );

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
						header: urlHeaders,
						id: 'url_name',
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

	const columns = useMemo( () => [
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.getValue(),
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
			cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item" onClick={ () => {
				setUrlDetailPanel( { url: cell.row.original.url_name, slug } );
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
			className: 'nolimit',
			cell: ( cell ) => columnTypes?.domain_type.values[ cell.getValue() ],
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
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons>
				<Button
					size="xxs"
					color="neutral"
					onClick={ () => {
						setUrlDetailPanel( { url: cell.row.original.url_name, slug } );
					} }
					sx={ { mr: 1 } }
				>
					{ __( 'Show Detail' ) }
				</Button>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),

	], [ columnHelper, setUrlDetailPanel, slug, columnTypes?.domain_type.values ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		! urlDetailPanel
			? <>
				<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
					{ __( "The table displays URLs that are ranked among the top 100 results in SERP. Next to each URL, you have the option to examine the key queries associated with each URL and the number of competitor domains intersecting with it for the same keywords. The more your URL intersects with those of your competitors, the greater its potential significance to your business. This report also provides ideas drawn from your competitors' websites on what a well-ranked page should look like. It can serve as a source of inspiration, helping you identify what type of content may be missing from your own website." ) }
				</DescriptionBox>
				<ModuleViewHeaderBottom
					noDelete
					noInsert
					noImport
				/>
				<Table className="fadeInto"
					initialState={ { columnVisibility: { url_description: false, best_position: false, top100_queries_cnt: false, country_value: false, country_volume: false } } }
					columns={ columns }
					data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
					defaultSorting={ defaultSorting }
					referrer={ ref }
					loadingRows={ isFetchingNextPage }
				>
					<TooltipSortingFiltering />
				</Table>
			</>
			: <Suspense>
				<UrlDetailPanel sourceTableSlug={ slug } />
			</Suspense>
	);
}
