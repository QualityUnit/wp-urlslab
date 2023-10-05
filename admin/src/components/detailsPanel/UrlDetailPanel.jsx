import useTablePanels from '../../hooks/useTablePanels';
import useCloseModal from '../../hooks/useCloseModal';
import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import '../../assets/styles/components/_SerpPanel.scss';
import SerpUrlDetailQueryTable from '../../tables/SerpUrlDetailQueryTable';
import SerpUrlDetailSimilarUrlsTable from '../../tables/SerpUrlDetailSimilarUrlsTable';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Tabs from '@mui/joy/Tabs';

function UrlDetailPanel() {
	const { CloseIcon, handleClose } = useCloseModal();
	const { url } = useTablePanels( ( state ) => state.options.urlDetailPanel );
	const { __ } = useI18n();

	return (
		<div className={ `urlslab-panel-wrap urlslab-panel-modal urlslab-changesPanel-wrap fadeInto` }>
			<div className="urlslab-panel customPadding">
				<div className="urlslab-panel-header">
					<h3>{ url }</h3>
					<button className="urlslab-panel-close" onClick={ handleClose }>
						<CloseIcon />
					</button>
				</div>
				<div className="urlslab-panel-content mt-l pl-m pr-xl">

					<Tabs defaultValue="queries">
						<TabList tabFlex="auto">
							<Tab value="queries">{ __( 'Queries' ) }</Tab>
							<Tab value="urls">{ __( 'Similar URLs' ) }</Tab>
						</TabList>
						<TabPanel value="queries">
							<SerpUrlDetailQueryTable slug="serp-urls-queries" handleClose={ handleClose } />
						</TabPanel>
						<TabPanel value="urls">
							<SerpUrlDetailSimilarUrlsTable slug="serp-urls-similar-urls" handleClose={ handleClose } />
						</TabPanel>
					</Tabs>
				</div>
			</div>
		</div>
	);
}

export default memo( UrlDetailPanel );
