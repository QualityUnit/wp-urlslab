// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery } from '@tanstack/react-query';

import { fetchSettings } from '../api/settings';
import Loader from '../components/Loader';
import SettingsOption from '../components/SettingsOption';

import '../assets/styles/layouts/_Settings.scss';

export default function Settings( { settingId } ) {
	const { data: settings, status } = useQuery( {
		queryKey: [ 'settings', settingId ],
		queryFn: () => fetchSettings( settingId ),
	} );

	if ( status === 'loading' ) {
		return <Loader />;
	}

	console.log( settings );

	return (
		<div className="urlslab-settingsPanel-wrap flex-tablet">
			<div className="urlslab-settingsPanel">
				{
					Object.values( settings ).map( ( section ) => {
						return (
							<section className="urlslab-settingspanel-section" key={ section.id }>
								<h4>{ section.title }</h4>
								<p>{ section.description }</p>

								{ Object.values( section.options ).map( ( option ) => {
									return (
										<div className="urlslab-settingspanel-option" key={ option.id }>
											{ /* <h5>{ option.title }</h5> */ }
											<SettingsOption settingId={ settingId } option={ option } />
											<p>{ option.description }</p>
										</div>
									);
								} ) }
							</section>
						);
					} )
				}
			</div>
		</div>
	);
}
