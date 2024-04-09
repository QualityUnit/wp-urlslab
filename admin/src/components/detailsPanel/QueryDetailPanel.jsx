import { memo, Suspense, lazy, useState, useEffect, useCallback } from 'react';
import { __ } from '@wordpress/i18n';

import useTableStore from '../../hooks/useTableStore';

import TableDetailsMenu from '../TableDetailsMenu';
import BackButton from '../../elements/BackButton';
import '../../assets/styles/components/_TableDetail.scss';
import { countriesList } from '../../api/fetchCountries';

const SerpQueryDetailRankedUrlsTable = lazy( () => import( '../../tables/SerpQueryDetailRankedUrlsTable' ) );
const SerpQueryDetailClusterUrlsTable = lazy( () => import( '../../tables/SerpQueryDetailClusterUrlsTable' ) );
const SerpQueryDetailQueryClusterTable = lazy( () => import( '../../tables/SerpQueryDetailQueryClusterTable' ) );

const detailMenu = {
	kwcluster: __( 'Cluster', 'urlslab' ),
	clusterurls: __( 'Cluster URLs', 'urlslab' ),
	rankedurls: __( 'Top 100 URLs', 'urlslab' ),
};

function QueryDetailPanel() {
	const queryDetailPanel = useTableStore( ( state ) => state.queryDetailPanel );
	const setQueryDetailPanel = useTableStore( ( state ) => state.setQueryDetailPanel );
	const setActiveTable = useTableStore( ( state ) => state.setActiveTable );
	const { query, country, sourceTableSlug } = queryDetailPanel;
	const [ activeSection, setActiveSection ] = useState( 'kwcluster' );

	const handleBack = useCallback( () => {
		setQueryDetailPanel( null );
		setActiveTable( sourceTableSlug );
	}, [ setActiveTable, setQueryDetailPanel, sourceTableSlug ] );

	// manage panel states on unmount
	useEffect( () => {
		return () => {
			handleBack();
		};
	}, [ handleBack ] );

	return (
		<div className="urlslab-tableDetail">
			<div className="urlslab-moduleView-header">
				<div className="urlslab-tableDetail-header urlslab-moduleView-headerTop pb-l">
					<BackButton onClick={ handleBack } className="fs-m">
						{ __( 'Back To Queries', 'urlslab' ) }
					</BackButton>
					<h4 className="urlslab-tableDetail-title" key={ `${ query }(${ country })` }>
						{ query } ({ countriesList[ country ] })
					</h4>
				</div>
				<TableDetailsMenu menu={ detailMenu } activeSection={ activeSection } activateSection={ ( val ) => setActiveSection( val ) } />
			</div>
			{
				activeSection === 'kwcluster' &&
				<Suspense>
					<SerpQueryDetailQueryClusterTable />
				</Suspense>
			}
			{
				activeSection === 'clusterurls' &&
				<Suspense>
					<SerpQueryDetailClusterUrlsTable />
				</Suspense>
			}
			{
				activeSection === 'rankedurls' &&
				<Suspense>
					<SerpQueryDetailRankedUrlsTable />
				</Suspense>
			}
		</div>
	);
}

export default memo( QueryDetailPanel );
