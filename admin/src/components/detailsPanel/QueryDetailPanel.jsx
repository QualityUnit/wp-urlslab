import useTablePanels from '../../hooks/useTablePanels';
import useCloseModal from '../../hooks/useCloseModal';
import { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryClusterKeywords, getTopUrls } from '../../lib/serpQueries';
import Loader from '../Loader';
import Table from '../TableComponent';
import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';
import { Tooltip } from '../../lib/tableImports';

function QueryDetailPanel() {
	const { __ } = useI18n();
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const { CloseIcon, handleClose } = useCloseModal();
	const { query, slug } = useTablePanels( ( state ) => state.options.queryDetailPanel );

	const { data: topUrls, isSuccess: topUrlsSuccess } = useQuery( {
		queryKey: [ `serp-queries/query/top-urls/${ slug }` ],
		queryFn: async () => {
			return await getTopUrls( query );
		},
	} );

	const { data: similarQueries, isSuccess: similarQueriesSuccess } = useQuery( {
		queryKey: [ `serp-queries/query/similar-queries/${ slug }` ],
		queryFn: async () => {
			return await getQueryClusterKeywords( query );
		},
	} );

	// Table Top URLs
	const topUrlsHeader = {
		url_name: __( 'URL' ),
		url_title: __( 'Title' ),
		url_description: __( 'Description' ),
		position: __( 'Position' ),
		clicks: __( 'Clicks' ),
		impressions: __( 'Impressions' ),
		ctr: __( 'CTR' ),
	};

	const topUrlsCol = [
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: () => topUrlsHeader.url_name,
			size: 100,
		} ),
		columnHelper.accessor( 'url_title', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: () => topUrlsHeader.url_title,
			size: 50,
		} ),
		columnHelper.accessor( 'url_description', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: () => topUrlsHeader.url_description,
			size: 50,
		} ),
		columnHelper.accessor( 'position', {
			cell: ( cell ) => cell.getValue(),
			header: () => topUrlsHeader.position,
			size: 20,
		} ),
		columnHelper.accessor( 'clicks', {
			cell: ( cell ) => cell.getValue(),
			header: () => topUrlsHeader.clicks,
			size: 20,
		} ),
		columnHelper.accessor( 'impressions', {
			cell: ( cell ) => cell.getValue(),
			header: () => topUrlsHeader.impressions,
			size: 20,
		} ),
		columnHelper.accessor( 'ctr', {
			cell: ( cell ) => cell.getValue(),
			header: () => topUrlsHeader.ctr,
			size: 20,
		} ),
	];

	return (
		<div className={ `urlslab-panel-wrap urlslab-panel-modal urlslab-changesPanel-wrap fadeInto` }>
			<div className="urlslab-panel urlslab-changesPanel customPadding">
				<div className="urlslab-panel-header">
					<h3>{ query }</h3>
					<button className="urlslab-panel-close" onClick={ handleClose }>
						<CloseIcon />
					</button>
				</div>
				<div className="mt-l pl-l pr-l">
					<h4>Top URLs</h4>
					<div className="mt-l mb-l table-container">
						{ ! topUrlsSuccess && <Loader /> }
						{ topUrlsSuccess && <Table
							slug="query/top-urls"
							columns={ topUrlsCol }
							data={ topUrlsSuccess && topUrls }
						/>
						}
					</div>
					<h4>Similar Queries</h4>
					{ ! similarQueriesSuccess && <Loader /> }
					{ similarQueriesSuccess && similarQueries?.length > 0 &&
						<ul>
							{ similarQueries.map( ( q ) => (
								<li key={ q.query_id }>
									{ q.query }
								</li>
							) ) }
						</ul>
					}
				</div>
			</div>
		</div>
	);
}

export default memo( QueryDetailPanel );
