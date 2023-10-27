/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { memo, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { createColumnHelper } from '@tanstack/react-table';

import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';

import { SingleSelectMenu, SortBy, TooltipSortingFiltering, useInfiniteFetch } from '../lib/tableImports';
import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import ProgressBar from '../elements/ProgressBar';
import Counter from '../components/RowCounter';
import ColumnsMenu from '../elements/ColumnsMenu';
import DescriptionBox from '../elements/DescriptionBox';
import TableActionsMenu from '../elements/TableActionsMenu';
import TableFilters from '../components/TableFilters';
import ExportPanel from '../components/ExportPanel';

const slug = 'serp-urls/url/similar-urls';
const defaultSorting = [ { key: 'cnt_queries', dir: 'DESC', op: '<' } ];

const domainTypes = {
	X: __( 'Uncategorized' ),
	M: __( 'My Domain' ),
	C: __( 'Competitor' ),
	I: __( 'Ignored' ),
};

const header = {
	url_name: __( 'URL' ),
	domain_type: __( 'Domain type' ),
	cnt_queries: __( 'Intersections' ),
	top10_queries_cnt: __( 'Top 10' ),
	top100_queries_cnt: __( 'Top 100' ),
};

function SerpUrlDetailSimilarUrlsTable( { url } ) {
	const columnHelper = useMemo( () => createColumnHelper(), [] );

	const [ popupTableType, setPopupTableType ] = useState( 'A' );

	const customFetchOptions = { url };

	const { data: similarQueries, status, isSuccess: UrlsSuccess, isFetchingNextPage,
		hasNextPage, ref } = useInfiniteFetch( { slug, customFetchOptions, defaultSorting }, 20 );

	const activePanel = useTablePanels( ( state ) => state.activePanel );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						slug,
						header,
						paginationId: 'url_id',
					},
				},
			}
		) );
	}, [ ] );

	const cols = useMemo( () => [
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'domain_type', {
			filterValMenu: domainTypes,
			className: 'nolimit',
			cell: ( cell ) => domainTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'cnt_queries', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } defaultSorting={ defaultSorting } />,
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
	], [ columnHelper ] );

	return (
		<>
			<DescriptionBox
				title={ __( 'About this table' ) }
				tableSlug={ slug }
				sx={ { mb: 2 } }
			>
				{ __( 'Table shows list of URLs most similar to selected URL based on number of intersecting queries' ) }
			</DescriptionBox>

			<div className="urlslab-moduleView-headerBottom">
				<div className="flex flex-justify-space-between flex-align-center">
					<SingleSelectMenu defaultAccept autoClose key={ popupTableType } items={ {
						A: __( 'All URLs' ),
						M: __( 'My URLs' ),
						C: __( 'Competitor URLs' ),
					} } name="url_view_type" defaultValue={ popupTableType } onChange={ ( val ) => setPopupTableType( val ) } />
					<TableFilters />
					<div className="ma-left flex flex-align-center">
						<TableActionsMenu options={ { noImport: true, noDelete: true } } />
						<Counter customFetchOptions={ customFetchOptions } className="ml-m mr-m" />
						<ColumnsMenu className="menu-left" />
					</div>
				</div>
			</div>

			{ status === 'loading'
				? <Loader />
				: <div className="urlslab-panel-content">

					<div className="mt-l mb-l table-container">
						<Table
							columns={ cols }
							data={ UrlsSuccess && similarQueries?.pages?.flatMap( ( page ) => page ?? [] ) }
							disableAddNewTableRecord
							defaultSorting={ defaultSorting }
							referer={ ref }
						>
							<TooltipSortingFiltering customFetchOptions={ customFetchOptions } />
							<>
								{ isFetchingNextPage ? '' : hasNextPage }
								<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
							</>
						</Table>
					</div>
				</div>
			}
			{ activePanel === 'export' &&
				<ExportPanel fetchOptions={ customFetchOptions } />
			}
		</>
	);
}

export default memo( SerpUrlDetailSimilarUrlsTable );
