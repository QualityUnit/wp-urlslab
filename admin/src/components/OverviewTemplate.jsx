import { lazy } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';

import { renameModule } from '../constants/helpers';

import Loader from './Loader';
import { ReactComponent as ApiIcon } from '../assets/images/api-exclamation.svg';
import Button from '../elements/Button';

import '../assets/styles/components/_OverviewTemplate.scss';

export default function Overview( { moduleId, children } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const moduleData = queryClient.getQueryData( [ 'modules' ] )[ moduleId ];
	const importPath = import( `../modules/${ renameModule( moduleId ) }.jsx` );
	const Module = lazy( () => importPath );

	// if ( ! Module() ) {
	// 	return <Loader />;
	// }

	return (
		<div className="urlslab-overview urlslab-panel fadeInto">
			{ ! moduleData.apikey &&
			<div className="urlslab-overview-apiKey flex-tablet">
				<div className="apiIcon xxl"><ApiIcon /></div>
				<div className="urlslab-overview-apiKey__content">
					<h3>{ __( 'This plugin needs api key' ) }</h3>
					<p>{ __( 'Without API key you are only able to retrieve data for homepage of any domain. To unlocking all urls you need to input API key.' ) }</p>
				</div>
				<Button href="https://www.urlslab.com" target="_blank" active>{ __( 'Get API key' ) }</Button>
			</div>
			}
			<div className="urlslab-overview-content">
				<h3>{ moduleData.title }</h3>
				{ children }
			</div>
		</div>
	);
}
