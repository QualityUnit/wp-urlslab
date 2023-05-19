import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';

import '../assets/styles/components/_OverviewTemplate.scss';

export const setSection = ( val ) => val;

export default function Overview( { moduleId, section, children } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const moduleData = queryClient.getQueryData( [ 'modules' ] )[ moduleId ];

	return (
		<div className="urlslab-overview urlslab-panel flex-tablet fadeInto">
			<ul className="urlslab-overview-menu">
				<li><button onClick={ () => section( 'about' ) }>{ __( 'About module' ) }</button></li>
				<li><button onClick={ () => section( 'integrate' ) }>{ __( 'How to integrate' ) }</button></li>
				<li><button onClick={ () => section( 'faq' ) }>{ __( 'FAQ' ) }</button></li>
			</ul>
			<div className="urlslab-overview-content">
				{ moduleData?.title && <h3> { moduleData.title } </h3> }
				{ children }
			</div>
		</div>
	);
}
