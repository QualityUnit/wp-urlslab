import { memo } from 'react';
import ContentGeneratorConfigPanel from './ContentGeneratorConfigPanel';

import '../../assets/styles/components/_ContentGeneratorPanel.scss';

function ContentGeneratorPanel() {
	return (
		<div className="urlslab-panel urlslab-content-gen-panel">
			<ContentGeneratorConfigPanel />
		</div>
	);
}

export default memo( ContentGeneratorPanel );
