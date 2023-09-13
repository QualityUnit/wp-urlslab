import { useI18n } from '@wordpress/react-i18n';
import { memo, useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getTopUrls } from '../lib/serpQueries';
import { SingleSelectMenu, Tooltip } from '../lib/tableImports';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import { renameModule } from '../lib/helpers';
import useAIGenerator from '../hooks/useAIGenerator';

function SerpQueryDetailTopUrlsTable( { query, slug, handleClose } ) {
	const { __ } = useI18n();
	const { setAIGeneratorConfig } = useAIGenerator();
	const columnHelper = useMemo( () => createColumnHelper(), [] );

	const [ popupTableType, setPopupTableType ] = useState( 'A' );

	const { data: topUrls, isSuccess: topUrlsSuccess } = useQuery( {
		queryKey: [ `serp-queries/query/top-urls/${ slug }` ],
		queryFn: async () => {
			return await getTopUrls( query, null, 100 );
		},
	} );

	const { data: myTopUrls, isSuccess: myTopUrlsSuccess } = useQuery( {
		queryKey: [ `serp-queries/query/top-urls/${ slug }/m` ],
		queryFn: async () => {
			return await getTopUrls( query, 'M', 100 );
		},
	} );

	const { data: competitorUrls, isSuccess: competitorUrlsSuccess } = useQuery( {
		queryKey: [ `serp-queries/query/top-urls/${ slug }/c` ],
		queryFn: async () => {
			return await getTopUrls( query, 'C', 100 );
		},
	} );

	// action handling
	const handleCreatePost = () => {
		// setting the correct zustand state
		setAIGeneratorConfig( {
			keywordsList: [ { q: query, checked: true } ],
			serpUrlsList: [],
			dataSource: 'SERP_CONTEXT',
			selectedPromptTemplate: '4',
			title: query,
		} );
		handleClose();
	};

	// Table Top URLs
	const topUrlsHeader = {
		url_name: __( 'URL' ),
		url_title: __( 'Title' ),
		url_description: __( 'Description' ),
		position: __( 'Position' ),
		impressions: __( 'Impressions' ),
		clicks: __( 'Clicks' ),
		ctr: __( 'CTR' ),
	};

	const topUrlsCol = [
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <Link to={ cell.getValue() } target="_blank">{ cell.getValue() }</Link>,
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
		columnHelper.accessor( 'impressions', {
			cell: ( cell ) => cell.getValue(),
			header: () => topUrlsHeader.impressions,
			size: 20,
		} ),
		columnHelper.accessor( 'clicks', {
			cell: ( cell ) => cell.getValue(),
			header: () => topUrlsHeader.clicks,
			size: 20,
		} ),
		columnHelper.accessor( 'ctr', {
			cell: ( cell ) => cell.getValue(),
			header: () => topUrlsHeader.ctr,
			size: 20,
		} ),
	];

	return (
		<div>
			<div className="urlslab-serpPanel-title">
				<h4>Top URLs</h4>
				<SingleSelectMenu defaultAccept autoClose key={ popupTableType } items={ {
					A: __( 'All URLs' ),
					M: __( 'My URLs' ),
					C: __( 'Competitor URLs' ),
				} } name="url_view_type" defaultValue={ popupTableType } onChange={ ( val ) => setPopupTableType( val ) } />
			</div>
			{ popupTableType === 'A' && <div className="mt-l mb-l table-container">
				{ ! topUrlsSuccess && <Loader /> }
				{ topUrlsSuccess && <Table
					slug="query/top-urls"
					columns={ topUrlsCol }
					data={ topUrlsSuccess && topUrls }
				/>
				}
			</div> }
			{ popupTableType === 'M' && <div className="mt-l mb-l table-container">
				{ ! myTopUrlsSuccess && <Loader /> }
				{ myTopUrlsSuccess && myTopUrls.length > 0 && <Table
					slug="query/top-urls"
					columns={ topUrlsCol }
					data={ myTopUrlsSuccess && myTopUrls }
				/>
				}
				{ myTopUrlsSuccess && myTopUrls.length === 0 && <div className="urlslab-serpPanel-empty-table">
					<p>None of your pages are ranking for this keyword</p>
					<Link
						className="urlslab-button active"
						to={ '/' + renameModule( 'urlslab-generator' ) }
						onClick={ handleCreatePost }>{ __( 'Create a Post' ) }</Link>
				</div>
				}
			</div> }
			{ popupTableType === 'C' && <div className="mt-l mb-l table-container">
				{ ! competitorUrlsSuccess && <Loader /> }
				{ competitorUrlsSuccess && <Table
					slug="query/top-urls"
					columns={ topUrlsCol }
					data={ competitorUrlsSuccess && competitorUrls }
				/>
				}
				{ competitorUrlsSuccess && competitorUrls.length === 0 && <div className="urlslab-serpPanel-empty-table">
					<p>None of your competitors are ranking for this keyword</p>
				</div>
				}
			</div> }
		</div>
	);
}

export default memo( SerpQueryDetailTopUrlsTable );
