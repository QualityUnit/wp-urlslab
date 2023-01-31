import { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';

import { fetchSettings } from '../api/settings';

import SearchField from '../elements/SearchField';
import BackButton from '../elements/BackButton';

import '../assets/styles/components/_MainMenu.scss';

export default function SettingsMenu( { modules, backButton, activeSetting } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const [ activeSettingId, setActiveSetting ] = useState( 'general' );
	const handleBackButton = ( module ) => {
		if ( backButton ) {
			backButton( module );
		}
	};

	const handleActive = ( setting ) => {
		setActiveSetting( setting );
		if ( activeSetting ) {
			activeSetting( setting );
		}
	};

	const activator = ( moduleId ) => {
		if ( moduleId === activeSettingId ) {
			return 'active';
		}
		return '';
	};

	const prefetchSettings = ( moduleId ) => {
		queryClient.fetchQuery( {
			queryKey: [ 'settings', moduleId ],
			queryFn: () => fetchSettings( moduleId ),
		} );
	};

	prefetchSettings( activeSettingId );

	return (
		<div className="urlslab-mainmenu-menu">
			<div className="urlslab-mainmenu-element urlslab-mainmenu-search">
				<SearchField />
			</div>
			<BackButton
				className="urlslab-mainmenu-element"
				onClick={ () => handleBackButton( 'urlslab-modules' ) }
			>
				{ __( 'Back to Home' ) }
			</BackButton>
			<ul className="urlslab-mainmenu-settings">
				{ modules.length
					? modules.map( ( module ) => {
						return (
							module.active || module.id === 'general'
								? <li key={ module.id } className={ `urlslab-mainmenu-item ${ activator( module.id ) }` }>
									<button
										type="button"
										onMouseEnter={ () => prefetchSettings( module.id ) }
										onClick={ () => handleActive( module.id ) }>{ module.title }
									</button>
								</li>
								: ''
						);
					} )
					: ''
				}
			</ul>
		</div>
	);
}
