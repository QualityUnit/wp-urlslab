// eslint-disable-next-line import/no-extraneous-dependencies
import { useQueryClient } from '@tanstack/react-query';
import Loader from '../components/Loader';
import SettingsOption from '../components/SettingsOption';

import '../assets/styles/layouts/_Settings.scss';

export default function Settings( { settingId } ) {
	const queryClient = useQueryClient();
	const settings = queryClient.getQueryData( [ 'settings', settingId ] );

	if ( ! settings?.length ) {
		return <Loader />;
	}

	return (
		<div className="urlslab-settingsPanel-wrap flex-tablet">
			<div className="urlslab-settingsPanel">
				{
					settings.map( ( section ) => {
						return (
							<section className="urlslab-settingspanel-section" key={ section.id }>
								<h4>{ section.title }</h4>
								<p>{ section.description }</p>

								{ section.options.map( ( option ) => {
									console.log( option );
									return (
										<div className="urlslab-settingspanel-option" key={ option.id }>
											{ /* <h5>{ option.title }</h5> */ }
											<SettingsOption option={ option } />
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
