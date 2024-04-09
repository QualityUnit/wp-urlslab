import { memo, lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { __ } from '@wordpress/i18n';

import useTableStore from '../../hooks/useTableStore';

import TableDetailsMenu from '../TableDetailsMenu';
import BackButton from '../../elements/BackButton';
import '../../assets/styles/components/_TableDetail.scss';

const SerpUrlDetailQueryTable = lazy( () => import( '../../tables/SerpUrlDetailQueryTable' ) );
const SerpUrlDetailSimilarUrlsTable = lazy( () => import( '../../tables/SerpUrlDetailSimilarUrlsTable' ) );

const detailMenu = {
	queries: __( 'Queries', 'urlslab' ),
	urls: __( 'Similar URLs', 'urlslab' ),
};

function UrlDetailPanel() {
	const urlDetailPanel = useTableStore( ( state ) => state.urlDetailPanel );
	const setUrlDetailPanel = useTableStore( ( state ) => state.setUrlDetailPanel );
	const setActiveTable = useTableStore( ( state ) => state.setActiveTable );

	const { url, sourceTableSlug } = urlDetailPanel;
	const [ activeSection, setActiveSection ] = useState( 'queries' );

	const handleBack = useCallback( () => {
		setUrlDetailPanel( null );
		setActiveTable( sourceTableSlug );
	}, [ setActiveTable, setUrlDetailPanel, sourceTableSlug ] );

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
						{ __( 'Back To URLs', 'urlslab' ) }
					</BackButton>
					<h4 className="urlslab-tableDetail-title">
						<a href={ url } target="_blank" rel="noreferrer">{ url }</a>
					</h4>
				</div>
				<TableDetailsMenu menu={ detailMenu } activeSection={ activeSection } activateSection={ ( val ) => setActiveSection( val ) } />
			</div>

			{
				activeSection === 'queries' &&
				<Suspense>
					<SerpUrlDetailQueryTable />
				</Suspense>
			}
			{
				activeSection === 'urls' &&
				<Suspense>
					<SerpUrlDetailSimilarUrlsTable />
				</Suspense>
			}
		</div>
	);
}

export default memo( UrlDetailPanel );
