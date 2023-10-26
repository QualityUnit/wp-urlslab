import { memo, Suspense, lazy, useState } from 'react';
import { __ } from '@wordpress/i18n';

import useTableStore from '../../hooks/useTableStore';

import TableDetailsMenu from '../TableDetailsMenu';
import BackButton from '../../elements/BackButton';
import '../../assets/styles/components/_TableDetail.scss';

const SerpQueryDetailTopUrlsTable = lazy( () => import( '../../tables/SerpQueryDetailTopUrlsTable' ) );
const SerpQueryDetailSimQueryTable = lazy( () => import( '../../tables/SerpQueryDetailSimQueryTable' ) );

const detailMenu = {
	kwcluster: __( 'Keyword Cluster' ),
	topurls: __( 'Ranked URLs' ),
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
					<h3 className="urlslab-tableDetail-title">
						{ query } ({ country })
					</h3>
				</div>
				<TableDetailsMenu menu={ detailMenu } activeSection={ activeSection } activateSection={ ( val ) => setActiveSection( val ) } />
			</div>
			{
				activeSection === 'kwcluster' &&
				<Suspense>
					<SerpQueryDetailSimQueryTable query={ query } country={ country } />
				</Suspense>
			}
			{
				activeSection === 'topurls' &&
				<Suspense>
					<SerpQueryDetailTopUrlsTable query={ query } country={ country } />
				</Suspense>
			}
		</div>
	);
}

export default memo( QueryDetailPanel );
