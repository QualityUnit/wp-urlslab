import { lazy } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';

import { renameModule } from '../constants/helpers';

import { ReactComponent as ApiIcon } from '../assets/images/api-exclamation.svg';
import Button from '../elements/Button';

import '../assets/styles/components/_OverviewTemplate.scss';

export default function Overview( { moduleId, children } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const moduleData = queryClient.getQueryData( [ 'modules' ] )[ moduleId ];

	return (
		<div className="urlslab-overview urlslab-panel fadeInto">
			{ moduleData.apikey &&
			<div className="urlslab-overview-apiKey flex-tablet">
				<div className="apiIcon xxl"><ApiIcon /></div>
				<div className="urlslab-overview-apiKey__content">
					<h3>{ __( 'The module requires URLsLab service' ) }</h3>
					<p>{ __( 'With URLsLab service, you can unlock the full potential of the module and reap the benefits of automation. Save yourself hours of tedious work and get accurate results - it\'s the smart way to automate data processing!' ) }</p>
				</div>
				<Button href="https://www.urlslab.com" target="_blank" active>{ __( 'Get the API Key' ) }</Button>
			</div>
			}
			<div className="urlslab-overview-content">
				<h3>{ moduleData.title }</h3>
				{ children }
			</div>
		</div>
	);
}
