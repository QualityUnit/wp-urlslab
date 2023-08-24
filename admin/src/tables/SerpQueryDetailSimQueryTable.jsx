import { useI18n } from '@wordpress/react-i18n';
import { memo, useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getQueryClusterKeywords } from '../lib/serpQueries';
import { Tooltip } from '../lib/tableImports';
import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import InputField from '../elements/InputField';
import useTablePanels from '../hooks/useTablePanels';
import Button from '../elements/Button';

function SerpQueryDetailSimQueryTable( { query, slug } ) {
	const { __ } = useI18n();
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const [ queryClusterData, setQueryClusterData ] = useState( { competitorCnt: 2, maxPos: 10 } );
	const { activatePanel, setOptions } = useTablePanels();

	const { data: similarQueries, isSuccess: similarQueriesSuccess } = useQuery( {
		queryKey: [ slug, queryClusterData ],
		queryFn: async () => {
			return await getQueryClusterKeywords( query, queryClusterData.maxPos, queryClusterData.competitorCnt, true );
		},
	} );

	const headers = {
		query: __( 'Query' ),
		matching_urls: __( 'Matching URLs' ),
		comp_urls: __( 'Comp. URLs' ),
		my_urls: __( 'My URLs' ),
		my_avg_pos: __( 'Avg. position' ),
		my_avg_imp: __( 'Avg. impressions' ),
		my_avg_ctr: __( 'Avg. CTR' ),
		my_avg_clk: __( 'Avg. clicks' ),
		my_min_pos: __( 'My best position' ),
		comp_avg_pos: __( 'Comp. avg. position' ),
	};

	const cols = [
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item" onClick={ () => handleSimKeyClick( cell.row.original.query ) }>{ cell.getValue() }</strong>,
			header: () => headers.query,
			size: 60,
		} ),
		columnHelper.accessor( 'matching_urls', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: () => headers.matching_urls,
			size: 60,
		} ),
		columnHelper.accessor( 'comp_urls', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: () => headers.comp_urls,
			size: 60,
		} ),
		columnHelper.accessor( 'comp_avg_pos', {
			cell: ( cell ) => cell.getValue(),
			header: () => headers.comp_avg_pos,
			size: 20,
		} ),
		columnHelper.accessor( 'my_urls', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: () => headers.my_urls,
			size: 60,
		} ),
		columnHelper.accessor( 'my_min_pos', {
			cell: ( cell ) => cell.getValue(),
			header: () => headers.my_min_pos,
			size: 20,
		} ),
		columnHelper.accessor( 'my_avg_pos', {
			cell: ( cell ) => cell.getValue(),
			header: () => headers.my_avg_pos,
			size: 20,
		} ),
		columnHelper.accessor( 'my_avg_imp', {
			cell: ( cell ) => cell.getValue(),
			header: () => headers.my_avg_imp,
			size: 20,
		} ),
		columnHelper.accessor( 'my_avg_ctr', {
			cell: ( cell ) => cell.getValue(),
			header: () => headers.my_avg_ctr,
			size: 20,
		} ),
		columnHelper.accessor( 'my_avg_clk', {
			cell: ( cell ) => cell.getValue(),
			header: () => headers.my_avg_clk,
			size: 20,
		} ),
	];

	const handleSimKeyClick = ( keyword ) => {
		setOptions( { queryDetailPanel: { query: keyword, slug: keyword.replace( ' ', '-' ) } } );
		activatePanel( 'queryDetailPanel' );
	};

	return (
		<div>
			<div className="urlslab-serpPanel-title">
				<h4>Similar Queries</h4>
				<div className="urlslab-serpPanel-input">
					<InputField type="number" liveUpdate defaultValue={ queryClusterData.competitorCnt }
						label="Number of Competitors" onChange={ ( val ) => setQueryClusterData( { ...queryClusterData, competitorCnt: val } ) } />
					<InputField className="ml-s" type="number" liveUpdate defaultValue={ queryClusterData.maxPos }
						label="Maximum Position" onChange={ ( val ) => setQueryClusterData( { ...queryClusterData, maxPos: val } ) } />
				</div>
			</div>
			{ ! similarQueriesSuccess && <Loader /> }
			{ similarQueriesSuccess && similarQueries?.length > 0 &&
				<div className="mt-l mb-l table-container">
					<Table
						slug="query/get_query_cluster"
						columns={ cols }
						data={ similarQueriesSuccess && similarQueries }
					/>
				</div>
			}
		</div>
	);
}

export default memo( SerpQueryDetailSimQueryTable );
