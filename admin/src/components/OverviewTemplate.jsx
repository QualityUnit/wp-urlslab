import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';

import '../assets/styles/components/_OverviewTemplate.scss';

export default function Overview( { moduleId, children } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const moduleData = queryClient.getQueryData( [ 'modules' ] )[ moduleId ];

	return (
		<div className="urlslab-overview urlslab-panel fadeInto">
			<div className="urlslab-overview-content">
				{ moduleData?.title && <h3> moduleData.title </h3> }
				{ children }
			</div>
		</div>
	);
}
