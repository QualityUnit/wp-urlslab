import { memo, Suspense, lazy, useState } from 'react';
import useTablePanels from '../../hooks/useTablePanels';
import { __ } from '@wordpress/i18n';
import TableDetailsMenu from '../TableDetailsMenu';
import '../../assets/styles/components/_TableDetail.scss';
import BackButton from '../../elements/BackButton';
import ExportPanel from '../ExportPanel';
import useTableStore from '../../hooks/useTableStore';

const SerpQueryDetailTopUrlsTable = lazy( () => import( '../../tables/SerpQueryDetailTopUrlsTable' ) );
const SerpQueryDetailSimQueryTable = lazy( () => import( '../../tables/SerpQueryDetailSimQueryTable' ) );

const detailMenu = {
	kwcluster: __( 'Keyword Cluster' ),
	topurls: __( 'Ranked URLs' ),
};

function QueryDetailPanel( { handleClose } ) {
	const queryDetailPanel = useTableStore( ( state ) => state.queryDetailPanel );
	const { query, country } = queryDetailPanel;
	const [ activeSection, setActiveSection ] = useState( 'kwcluster' );
	const activePanel = useTablePanels( ( state ) => state.activePanel );

	const handleBack = () => {
		handleClose();
		const cleanState = { ...useTableStore.getState() };
		delete cleanState.queryDetailPanel;
		useTableStore.setState( { cleanState } );
	};

	return (
		<div className="urlslab-tableDetail">
			<div className="urlslab-moduleView-header">
				<div className="urlslab-tableDetail-header urlslab-moduleView-headerTop">
					<BackButton onClick={ handleBack } className="mb-l">
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
					<SerpQueryDetailSimQueryTable query={ query } country={ country } handleClose={ handleClose } />
				</Suspense>
			}
			{
				activeSection === 'topurls' &&
				<Suspense>
					<SerpQueryDetailTopUrlsTable query={ query } country={ country } handleClose={ handleClose } />
				</Suspense>
			}

			{ activePanel === 'export' &&
				<ExportPanel />
			}
		</div>
	);
}

export default memo( QueryDetailPanel );
