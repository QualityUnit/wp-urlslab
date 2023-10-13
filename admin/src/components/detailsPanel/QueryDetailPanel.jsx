import useTablePanels from '../../hooks/useTablePanels';
import useCloseModal from '../../hooks/useCloseModal';
import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import '../../assets/styles/components/_SerpPanel.scss';
import SerpQueryDetailTopUrlsTable from '../../tables/SerpQueryDetailTopUrlsTable';
import SerpQueryDetailSimQueryTable from '../../tables/SerpQueryDetailSimQueryTable';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Tabs from '@mui/joy/Tabs';

function QueryDetailPanel() {
	const { CloseIcon, handleClose } = useCloseModal();
	const queryDetailPanel = useTablePanels( ( state ) => state.options.queryDetailPanel );
	const { query, country } = queryDetailPanel;
	const { __ } = useI18n();

	return (
		<div className={ `urlslab-panel-wrap urlslab-panel-modal urlslab-changesPanel-wrap fadeInto` }>
			<div className="urlslab-panel customPadding">
				<div className="urlslab-panel-header">
					<h3>{ query } ({ country })</h3>
					<button className="urlslab-panel-close" onClick={ handleClose }>
						<CloseIcon />
					</button>
				</div>
				<div className="urlslab-panel-content mt-l pl-m pr-xl">

					<Tabs defaultValue="kwcluster">
						<TabList tabFlex="auto">
							<Tab value="kwcluster">{ __( 'Keyword Cluster' ) }</Tab>
							<Tab value="topurls">{ __( 'Ranked URLs' ) }</Tab>
						</TabList>
						<TabPanel value="kwcluster">
							<SerpQueryDetailSimQueryTable query={ query } country={ country } slug="kwcluster" handleClose={ handleClose } />
						</TabPanel>
						<TabPanel value="topurls">
							<SerpQueryDetailTopUrlsTable query={ query } country={ country } slug="topurls" handleClose={ handleClose } />
						</TabPanel>
					</Tabs>
				</div>
			</div>
		</div>
	);
}

export default memo( QueryDetailPanel );
