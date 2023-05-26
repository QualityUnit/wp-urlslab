// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchSettings } from '../api/settings';
import Loader from '../components/Loader';
import SettingsOption from '../components/SettingsOption';

import '../assets/styles/layouts/_Settings.scss';

export default function Settings( { className, settingId } ) {
	const queryClient = useQueryClient();

	const handleClick = ( event ) => {
		document.querySelectorAll( '.urlslab-settingsPanel-section' ).forEach( ( section ) => section.classList.remove( 'active' ) );
		event.target?.closest( '.urlslab-settingsPanel-section' ).classList.add( 'active' );
	};

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

	if ( status === 'loading' ) {
		return <Loader />;
	}

	const settings = data ? Object.values( data ) : [];

	return (
		<>
			{ Object.values( settings ).map( ( section ) => {
				return (
					section.options
						// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
						? <section onClick={ handleClick } className={ `urlslab-settingsPanel-section ${ className }` } key={ section.id }>
							<div className="urlslab-settingsPanel urlslab-panel flex-tablet-landscape">
								<div className="urlslab-settingsPanel-desc">
									<h4>{ section.title }</h4>
									<p>{ section.description }</p>
								</div>
								<div className="urlslab-settingsPanel-options" >
									{
										Object.values( section.options ).map( ( option ) => {
											return (
												<SettingsOption settingId={ settingId } option={ option } key={ option.id } />
											);
										} )
									}
								</div>
							</div>
						</section>
						: ''
				);
			} ) }
		</>
	);
}
