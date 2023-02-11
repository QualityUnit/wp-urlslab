// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchSettings } from '../api/settings';
import Loader from '../components/Loader';
// import SettingsOption from '../components/SettingsOption';

import '../assets/styles/layouts/_Settings.scss';
import { useI18n } from '@wordpress/react-i18n/';

export default function Settings( { settingId } ) {
	const queryClient = useQueryClient();
	const { __ } = useI18n();

	const { data, status } = useQuery( {
		queryKey: [ 'settings', settingId ],
		queryFn: () => fetchSettings( settingId ),
		initialData: () => {
			if ( settingId === 'general' ) {
				return queryClient.getQueryData( [ 'settings', 'general' ] );
			}
		},
	} );
	let settings = useMemo( () => {
		return data;
	}, [ data ] );

	if ( status === 'loading' ) {
		return <Loader />;
	}

	settings = Object.values( data );

	return (
		<div className="urlslab-settingsPanel-wrap flex-tablet">
			<div className="urlslab-settingsPanel">

				{ Object.values( settings ).map( ( section ) => {
					return (
						<section className="urlslab-settingspanel-section" key={ section.id }>
							<h4>{ section.title }</h4>
							<p>{ section.description }</p>

							{ section.options
								? Object.values( section.options ).map( ( option ) => {
									return (
										<SettingsOption settingId={ settingId } option={ option } key={ option.id } />
									);
								} )
								: <h2>{ __( 'No options available' ) }</h2>
							}
						</section>
					);
				} )
				}
			</div>
		</div>
	);
}
