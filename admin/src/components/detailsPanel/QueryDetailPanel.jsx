import useTablePanels from '../../hooks/useTablePanels';
import useCloseModal from '../../hooks/useCloseModal';
import { memo, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryClusterKeywords, getTopUrls } from '../../lib/serpQueries';
import Loader from '../Loader';
import Table from '../TableComponent';
import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';
import { SingleSelectMenu, Tooltip } from '../../lib/tableImports';
import '../../assets/styles/components/_SerpPanel.scss';
import Button from '../../elements/Button';
import { Link } from 'react-router-dom';
import { renameModule } from '../../lib/helpers';
import useAIGenerator from '../../hooks/useAIGenerator';
import InputField from '../../elements/InputField';

function QueryDetailPanel() {
	const { __ } = useI18n();
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const { CloseIcon, handleClose } = useCloseModal();
	const { query, slug } = useTablePanels( ( state ) => state.options.queryDetailPanel );
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const [ popupTableType, setPopupTableType ] = useState( 'A' );
	const [ queryClusterData, setQueryClusterData ] = useState( { competitorCnt: 4, maxPos: 10 } );
	const { activatePanel, setOptions } = useTablePanels();

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

	const { data: similarQueries, isSuccess: similarQueriesSuccess } = useQuery( {
		queryKey: [ slug, queryClusterData ],
		queryFn: async () => {
			return await getQueryClusterKeywords( query, queryClusterData.maxPos, queryClusterData.competitorCnt );
		},
	} );

	// action handling
	const handleCreatePost = () => {
		// setting the correct zustand state
		setAIGeneratorConfig( {
			...aiGeneratorConfig,
			keywordsList: [ { q: query, checked: true } ],
			serpUrlsList: [],
			dataSource: 'SERP_CONTEXT',
			selectedPromptTemplate: '4',
			title: query,
		} );
		handleClose();
	};

	const handleSimKeyClick = ( keyword ) => {
		setOptions( { queryDetailPanel: { query: keyword, slug: keyword.replace( ' ', '-' ) } } );
		activatePanel( 'queryDetailPanel' );
	};

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
						<ul>
							{ similarQueries.map( ( q ) => (
								q.query !== query && <li onClick={ () => handleSimKeyClick( q.query ) } className="urlslab-serpPanel-keywords-item" key={ q.query_id }>
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
