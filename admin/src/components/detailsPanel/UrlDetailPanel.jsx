import { memo, lazy, Suspense, useState } from 'react';
import { __ } from '@wordpress/i18n';

import useTableStore from '../../hooks/useTableStore';

import TableDetailsMenu from '../TableDetailsMenu';
import BackButton from '../../elements/BackButton';
import '../../assets/styles/components/_TableDetail.scss';

const SerpUrlDetailQueryTable = lazy( () => import( '../../tables/SerpUrlDetailQueryTable' ) );
const SerpUrlDetailSimilarUrlsTable = lazy( () => import( '../../tables/SerpUrlDetailSimilarUrlsTable' ) );

const detailMenu = {
	queries: __( 'Queries' ),
	urls: __( 'Similar URLs' ),
};

function UrlDetailPanel( { handleClose } ) {
	const { url } = useTableStore( ( state ) => state.urlDetailPanel );
	const [ activeSection, setActiveSection ] = useState( 'queries' );

	const handleBack = () => {
		handleClose();
		const cleanState = { ...useTableStore.getState() };
		delete cleanState.urlDetailPanel;
		useTableStore.setState( { cleanState } );
	};

	return (
		<div className="urlslab-tableDetail">
			<div className="urlslab-moduleView-header">
				<div className="urlslab-tableDetail-header urlslab-moduleView-headerTop">
					<BackButton onClick={ handleBack }>
						{ __( 'Back To URLs' ) }
					</BackButton>
					<h3 className="urlslab-tableDetail-title">
						<a href={ url } target="_blank" rel="noreferrer">{ url }</a>
					</h3>
				</div>
				<TableDetailsMenu menu={ detailMenu } activeSection={ activeSection } activateSection={ ( val ) => setActiveSection( val ) } />
			</div>

			{
				activeSection === 'queries' &&
				<Suspense>
					<SerpUrlDetailQueryTable url={ url } slug="serp-urls-queries" />
				</Suspense>
			}
			{
				activeSection === 'urls' &&
				<Suspense>
					<SerpUrlDetailSimilarUrlsTable url={ url } slug="serp-urls-similar-urls" />
				</Suspense>
			}
		</div>
	);
}

export default memo( UrlDetailPanel );
