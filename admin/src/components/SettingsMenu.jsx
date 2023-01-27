import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import SearchField from '../elements/SearchField';

import '../assets/styles/components/_MainMenu.scss';
import BackButton from '../elements/BackButton';

export default function SettingsMenu( { modules, activePage } ) {
	const { __ } = useI18n();
	const [ activeId, setActive ] = useState( 'urlslab-generalsettings' );
	const handleActive = ( module ) => {
		setActive( module );
		if ( activePage ) {
			activePage( module );
		}
	};

	const activator = ( moduleId ) => {
		if ( moduleId === activeId ) {
			return 'active';
		}
		return '';
	};

	return (
		<div className="urlslab-mainmenu-menu">
			<div className="urlslab-mainmenu-element urlslab-mainmenu-search">
				<SearchField />
			</div>
			<BackButton
				className="urlslab-mainmenu-element"
				onClick={ () => handleActive( 'urlslab-modules' ) }
			>
				{ __( 'Back to Home' ) }
			</BackButton>
			<ul className="urlslab-mainmenu-settings">
				<li key="urlslab-settings"
					className={ `urlslab-mainmenu-item ${ activator( 'urlslab-generalsettings' ) }` }>
					<button
						type="button"
						onClick={ () => handleActive( 'urlslab-generalsettings' ) }>{ __( 'General Settings' ) }
					</button>
				</li>

				{ modules.length
					? modules.map( ( module ) => {
						return (
							module.active
								? <li key={ module.id } className={ `urlslab-mainmenu-item ${ activator( module.id ) }` }>
									<button
										type="button"
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
