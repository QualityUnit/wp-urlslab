// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchSettings } from '../api/settings';
import Loader from '../components/Loader';
import SettingsOption from '../components/SettingsOption';

import '../assets/styles/layouts/_Settings.scss';

export default function Settings( { className, settingId } ) {
	const queryClient = useQueryClient();

	const { data, status } = useQuery( {
		queryKey: [ 'settings', settingId ],
		queryFn: () => fetchSettings( settingId ),
		initialData: () => {
			if ( settingId === 'general' ) {
				return queryClient.getQueryData( [ 'settings', 'general' ] );
			}
		},
		refetchOnWindowFocus: false,
	} );
	let settings = useMemo( () => {
		return data;
	}, [ data ] );

	if ( status === 'loading' ) {
		return <Loader />;
	}

	settings = Object.values( data );

	return (
		Object.values( settings ).map( ( section ) => {
			return (
				<section className={ `urlslab-settingsPanel-section ${ className }` } key={ section.id }>
					<div className="urlslab-settingsPanel urlslab-panel flex-tablet-landscape">
						<div className="urlslab-settingsPanel-desc">
							<h4>{ section.title }</h4>
							<p>{ section.description }</p>
						</div>
						<div className="urlslab-settingsPanel-options">
							{ section.options
								? Object.values( section.options ).map( ( option ) => {
									return (
										<SettingsOption settingId={ settingId } option={ option } key={ option.id } />
									);
								} )
								: ''
							}
						</div>
					</div>
				</section>
			);
		} )
	);
}
