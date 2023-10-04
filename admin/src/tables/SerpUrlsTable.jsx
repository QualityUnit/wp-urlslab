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
import Button from "@mui/joy/Button";
import {Link} from "react-router-dom";

export default function SerpUrlsTable( { slug } ) {
	const { __ } = useI18n();
	const title = '';
	const paginationId = 'url_id';
	const defaultSorting = [ { key: 'top10_queries_cnt', dir: 'DESC', op: '<' } ];
	const { activatePanel, setOptions, setRowToEdit } = useTablePanels();
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
				title,
				paginationId,
				slug,
				header,
				id: 'url_name',
				sorting: defaultSorting,
			}
		) );
	}, [] );

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
			}
		) );
	}, [ data ] );

	const columns = [
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong className="urlslab-serpPanel-url-item"
									  onClick={ () => {
										  setOptions( { urlDetailPanel: { url: cell.row.original.url_name, slug:slug } } );
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
						setOptions( { urlDetailPanel: { url: cell.row.original.url_name, slug: cell.row.original.query.replace( ' ', '-' ) } } );
						activatePanel( 'queryDetailPanel' );
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
