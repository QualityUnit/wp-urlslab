import useTablePanels from '../../hooks/useTablePanels';
import useCloseModal from '../../hooks/useCloseModal';
import { memo } from 'react';
import '../../assets/styles/components/_SerpPanel.scss';
import SerpQueryDetailTopUrlsTable from '../../tables/SerpQueryDetailTopUrlsTable';
import SerpQueryDetailSimQueryTable from '../../tables/SerpQueryDetailSimQueryTable';

function QueryDetailPanel() {
	const { CloseIcon, handleClose } = useCloseModal();
	const { query, country, slug } = useTablePanels( ( state ) => state.options.queryDetailPanel );

	return (
		<div className={ `urlslab-panel-wrap urlslab-panel-modal urlslab-changesPanel-wrap fadeInto` }>
			<div className="urlslab-panel customPadding">
				<div className="urlslab-panel-header">
					<h3>{ query }</h3>
					<button className="urlslab-panel-close" onClick={ handleClose }>
						<CloseIcon />
					</button>
				</div>
				<div className="urlslab-panel-content mt-l pl-m pr-xl">
					<SerpQueryDetailSimQueryTable query={ query } country={ country } slug={ slug } />
					<SerpQueryDetailTopUrlsTable query={ query } country={ country } slug={ slug } handleClose={ handleClose } />
				</div>
			</div>
		</div>
	);
}

export default memo( QueryDetailPanel );
