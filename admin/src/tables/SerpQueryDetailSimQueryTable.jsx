/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useI18n } from '@wordpress/react-i18n';
import { memo, useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import useTablePanels from '../hooks/useTablePanels';

import { getQueryClusterKeywords } from '../lib/serpQueries';

import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import InputField from '../elements/InputField';
import { getTooltipUrlsList } from '../lib/elementsHelpers';
import { SortBy, TooltipSortingFiltering } from '../lib/tableImports';

function SerpQueryDetailSimQueryTable( { query, country, slug } ) {
	const { __ } = useI18n();
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const [ queryClusterData, setQueryClusterData ] = useState( { competitorCnt: 2, maxPos: 10 } );
	const { activatePanel, setOptions } = useTablePanels();

	const { data: similarQueries, isSuccess: similarQueriesSuccess } = useQuery( {
		queryKey: [ slug, queryClusterData ],
		queryFn: async () => {
			return await getQueryClusterKeywords( query, country, queryClusterData.maxPos, queryClusterData.competitorCnt );
		},
	} );

	const headers = {
		query: __( 'Query' ),
		matching_urls: __( 'URL Intersections' ),
		comp_urls: __( 'Comp. URLs' ),
		my_urls: __( 'My URLs' ),
		my_min_pos: __( 'My best position' ),
	};

	const cols = [
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item"
				onClick={ () => handleSimKeyClick( cell.row.original.query, cell.row.original.country ) }>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			size: 60,
		} ),
		columnHelper.accessor( 'matching_urls', {
			tooltip: ( cell ) => getTooltipUrlsList( cell.getValue() ),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'comp_urls', {
			tooltip: ( cell ) => getTooltipUrlsList( cell.getValue() ),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_urls', {
			tooltip: ( cell ) => getTooltipUrlsList( cell.getValue() ),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_min_pos', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 20,
		} ),
	];

	const handleSimKeyClick = ( keyword, countryvar ) => {
		setOptions( { queryDetailPanel: { query: keyword, country: countryvar, slug: keyword.replace( ' ', '-' ) } } );
		activatePanel( 'queryDetailPanel' );
	};

	return (
		<div>
			<div className="urlslab-serpPanel-title">
				<div className="urlslab-serpPanel-description">
					<h4>{ __( 'What is the keyword cluster?' ) }</h4>
					<p>{ __( 'It is list of similar queries identified by intersection of urls in top X results in Google search results. You can define your own intersection limits (e.g. min 3 urls from 10 or more strict 5 from 10). Basic idea behind the cluster is, that if Google ranked same urls for different keywords, those keywords are related and maybe you should cover all of them on single URL of your website.' ) }</p>
				</div>
				<div className="urlslab-serpPanel-input">
					<InputField type="number" liveUpdate defaultValue={ queryClusterData.competitorCnt }
						label={ __( 'Number of Competitors' ) } onChange={ ( val ) => setQueryClusterData( { ...queryClusterData, competitorCnt: val } ) } />
					<InputField className="ml-s" type="number" liveUpdate defaultValue={ queryClusterData.maxPos }
						label={ __( 'Maximum Position' ) } onChange={ ( val ) => setQueryClusterData( { ...queryClusterData, maxPos: val } ) } />
				</div>
			</div>
			{ ! similarQueriesSuccess && <Loader /> }
			{ similarQueriesSuccess && similarQueries?.length > 0 &&
				<div className="mt-l mb-l table-container">
					<Table
						initialState={ { columnVisibility: { comp_urls: false } } }
						slug="query/get_query_cluster"
						columns={ cols }
						data={ similarQueriesSuccess && similarQueries }
					>
						<TooltipSortingFiltering />
					</Table>
				</div>
			}
		</div>
	);
}

export default memo( SerpQueryDetailSimQueryTable );
