import { useState, useRef, useEffect } from 'react';
import { get, set, del } from 'idb-keyval';
import { useI18n } from '@wordpress/react-i18n';
import { ReactComponent as MenuArrow } from '../assets/images/arrow-simple.svg';
import { ReactComponent as ModulesIcon } from '../assets/images/menu-icon-modules.svg';
import { ReactComponent as SettingsIcon } from '../assets/images/menu-icon-settings.svg';
import '../assets/styles/components/_MainMenu.scss';

export default function MainMenu( { activeModule, modules, activePage } ) {
	const { __ } = useI18n();
	const mainmenu = useRef();
	const [ activeId, setActive ] = useState( 'urlslab-modules' );

	const activeModules = modules?.length ? modules.filter( ( module ) => module.active ) : [];

	const handleMainMenu = ( ) => {
		const menuState = mainmenu.current.classList.contains( 'open' );
		if ( menuState ) {
			del( 'urlslab-mainmenu' ).then( () => {
				mainmenu.current.classList.remove( 'open' );
			} );
		}

		if ( ! menuState ) {
			set( 'urlslab-mainmenu', 'open' ).then( () => {
				mainmenu.current.classList.add( 'open' );
			} );
		}
	};

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

	useEffect( () => {
		get( 'urlslab-mainmenu' ).then( ( val ) => {
			if ( val === 'open' || window.matchMedia( '(min-width: 1600px)' ).matches ) {
				mainmenu.current.classList.add( 'open' );
			}
		}
		);
	} );

	return (
		<nav className={ `urlslab-mainmenu` } ref={ mainmenu }>
			<button type="button"
				onClick={ ( event ) => handleMainMenu( event ) }
				className="urlslab-mainmenu-title"
			>
				<div className="inn">
					<MenuArrow />
					{ __( 'Menu' ) }
				</div>
			</button>
			<div className="urlslab-mainmenu-main flex">
				<ul className="urlslab-mainmenu-icons">
					<li className={ `urlslab-mainmenu-item ${ activator( 'urlslab-modules' ) }` }>
						<button
							className="urlslab-mainmenu-btn has-icon"
							onClick={ () => handleActive( 'urlslab-modules' ) }>
							<ModulesIcon className="" />
							<span>{ __( 'Modules' ) }</span>
						</button>
					</li>
					<li className={ `urlslab-mainmenu-item settings ${ activator( 'urlslab-settings' ) }` }>
						<button
							className="urlslab-mainmenu-btn has-icon"
							onClick={ () => handleActive( 'urlslab-settings' ) }>
							<SettingsIcon />
							<span>{ __( 'Settings' ) }</span>
						</button>
					</li>
				</ul>

				<ul className="urlslab-mainmenu-menu">
					<li key="urlslab-modules"
						className={ `urlslab-mainmenu-item ${ activator( 'urlslab-modules' ) }` }>
						<button
							type="button"
							className="urlslab-mainmenu-btn has-icon"
							onClick={ () => handleActive( 'urlslab-modules' ) }>
							<span>{ __( 'Modules' ) }</span>
						</button>
					</li>
					<li className="urlslab-mainmenu-item submenu">
						<ul className="urlslab-mainmenu-submenu" style={ { '--activeModules': activeModules.length } }>
							{ modules.length
								? modules.map( ( module ) => {
									return (
										module.active
											? <li key={ module.id } className={ `urlslab-mainmenu-item ${ activator( module.id ) }` }>
												<button
													type="button"
													className="urlslab-mainmenu-btn"
													onClick={ () => handleActive( module.id ) }>
													<span>{ module.title }</span>
												</button>
											</li>
											: ''
									);
								} )
								: ''
							}
						</ul>
					</li>

					<li key="urlslab-settings"
						className={ `urlslab-mainmenu-item ${ activator( 'urlslab-settings' ) }` }>
						<button
							type="button"
							className="urlslab-mainmenu-btn has-icon"
							onClick={ () => handleActive( 'urlslab-settings' ) }>
							<span>{ __( 'Settings' ) }</span>
						</button>
					</li>
				</ul>
			</div>
		</nav>
	);
}
