import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import '../assets/styles/components/_MainMenu.scss';

export default function MainMenu( { activeModule, modules, activePage } ) {
	const { __ } = useI18n();
	const [ activeId, setActive ] = useState( 'urlslab-modules' );
	const handleActive = ( module ) => {
		setActive( module );
		if ( activePage ) {
			activePage( module );
		}
	};

	const activator = ( moduleId ) => {
		if ( moduleId === activeId || moduleId === activeModule ) {
			return 'active';
		}
		return '';
	};

	return (
		<ul className="urlslab-mainmenu-menu urlslab-mainmenu-main">
			<li key="urlslab-modules"
				className={ `urlslab-mainmenu-item ${ activator( 'urlslab-modules' ) }` }>
				<button
					type="button"
					onClick={ () => handleActive( 'urlslab-modules' ) }>{ __( 'Modules' ) }
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
			<li key="urlslab-settings"
				className="urlslab-mainmenu-item">
				<button
					type="button"
					onClick={ () => handleActive( 'urlslab-settings' ) }>{ __( 'Settings' ) }
				</button>
			</li>
		</ul>
	);
}
