import { memo, Suspense, lazy, useState } from 'react';
import { __ } from '@wordpress/i18n';

import useTableStore from '../../hooks/useTableStore';

import TableDetailsMenu from '../TableDetailsMenu';
import BackButton from '../../elements/BackButton';
import '../../assets/styles/components/_TableDetail.scss';
import {countriesList} from "../../api/fetchCountries";

const SerpQueryDetailRankedUrlsTable = lazy( () => import( '../../tables/SerpQueryDetailRankedUrlsTable' ) );
const SerpQueryDetailClusterUrlsTable = lazy( () => import( '../../tables/SerpQueryDetailClusterUrlsTable' ) );
const SerpQueryDetailQueryClusterTable = lazy( () => import( '../../tables/SerpQueryDetailQueryClusterTable' ) );

const detailMenu = {
	kwcluster: __( 'Cluster' ),
	clusterurls: __( 'Cluster URLs' ),
	rankedurls: __( 'Top100 URLs' ),
};

function QueryDetailPanel( { handleBack } ) {
	const queryDetailPanel = useTableStore( ( state ) => state.queryDetailPanel );
	const { query, country } = queryDetailPanel;
	const [ activeSection, setActiveSection ] = useState( 'kwcluster' );

	return (
		<div className="urlslab-tableDetail">
			<div className="urlslab-moduleView-header">
				<div className="urlslab-tableDetail-header urlslab-moduleView-headerTop">
					<BackButton onClick={ handleBack }>
						{ __( 'Back To Queries' ) }
					</BackButton>
					<h3 className="urlslab-tableDetail-title" key={ `${ query }(${ country })` }>
						{ query } ({ countriesList[country] })
					</h3>
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
