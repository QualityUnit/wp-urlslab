import { useRef, useEffect, useMemo } from 'react';
import { get, set, del } from 'idb-keyval';
import { useI18n } from '@wordpress/react-i18n';
import useMainMenu from '../hooks/useMainMenu';

import { ReactComponent as MenuArrow } from '../assets/images/arrow-simple.svg';
import { ReactComponent as ModulesIcon } from '../assets/images/menu-icon-modules.svg';
import { ReactComponent as SettingsIcon } from '../assets/images/menu-icon-settings.svg';
import '../assets/styles/components/_MainMenu.scss';
import useModulesQuery from '../queries/useModulesQuery';

export default function MainMenu() {
	const { __ } = useI18n();
	const mainmenu = useRef();

	const { setActivePage, getActivePage, activePage } = useMainMenu();

	const { data: modules, isSuccess: isSuccessModules } = useModulesQuery();

	const loadedModules = Object.values( modules ? modules : {} );
	const activeModules = useMemo( () => loadedModules.length ? loadedModules.filter( ( mod ) => mod.active ) : [], [ loadedModules ] );

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

	const activator = ( moduleId ) => {
		if ( ! moduleId ) {
			return '';
		}
		if ( moduleId === activePage ) {
			return 'active';
		}
	};

	useEffect( () => {
		getActivePage();
		get( 'urlslab-mainmenu' ).then( ( val ) => {
			if ( val === 'open' || window.matchMedia( '(min-width: 1600px)' ).matches ) {
				mainmenu.current?.classList.add( 'open' );
			}
		} );
	} );

	return ( ( isSuccessModules && loadedModules ) &&
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
			<ul className="urlslab-mainmenu-menu">
				<li key="urlslab-modules-main"
					className={ `urlslab-mainmenu-item urlslab-modules has-icon ${ activator( 'urlslab-modules' ) }` }>
					<button
						type="button"
						className="urlslab-mainmenu-btn has-icon"
						onClick={ () => setActivePage( 'urlslab-modules' ) }>
						<ModulesIcon />
						<span>{ __( 'Modules' ) }</span>
					</button>
				</li>
				<li className="urlslab-mainmenu-item submenu">
					<ul className="urlslab-mainmenu-submenu" style={ { '--activeModules': activeModules.length + 1 } }>
						<li key="urlslab-modules"
							className={ `urlslab-mainmenu-item ${ activator( 'urlslab-modules' ) }` }>
							<button
								type="button"
								className="urlslab-mainmenu-btn"
								onClick={ () => setActivePage( 'urlslab-modules' ) }>
								<span>{ __( 'All modules' ) }</span>
							</button>
						</li>
						{ loadedModules.length
							? loadedModules.map( ( modul ) => {
								return (
									modul.id !== 'general' && modul.active
										? <li key={ modul.id } className={ `urlslab-mainmenu-item ${ activator( modul.id ) }` }>
											<button
												type="button"
												className="urlslab-mainmenu-btn"
												onClick={ () => setActivePage( modul.id ) }>
												<span>{ modul.title }</span>
											</button>
										</li>
										: ''
								);
							} )
							: 'xxx'
						}
					</ul>
				</li>

				<li key="urlslab-settings-main"
					className={ `urlslab-mainmenu-item urlslab-settings has-icon ${ activator( 'urlslab-settings' ) }` }>
					<button
						type="button"
						className="urlslab-mainmenu-btn has-icon"
						onClick={ () => setActivePage( 'urlslab-settings' ) }>
						<SettingsIcon />
						<span>{ __( 'Settings' ) }</span>
					</button>
				</li>

				<li className="urlslab-mainmenu-item submenu">
					<ul className="urlslab-mainmenu-submenu">
						<li key="urlslab-settings"
							className={ `urlslab-mainmenu-item ${ activator( 'urlslab-settings' ) }` }>
							<button
								type="button"
								className="urlslab-mainmenu-btn"
								onClick={ () => setActivePage( 'urlslab-settings' ) }>
								<span>{ __( 'General settings' ) }</span>
							</button>
						</li>
						<li key="urlslab-schedule"
							className={ `urlslab-mainmenu-item ${ activator( 'urlslab-schedule' ) }` }>
							<button
								type="button"
								className="urlslab-mainmenu-btn"
								onClick={ () => setActivePage( 'urlslab-schedule' ) }>
								<span>{ __( 'Schedules' ) }</span>
							</button>
						</li>
						<li key="TagsLabels"
							className={ `urlslab-mainmenu-item ${ activator( 'TagsLabels' ) }` }>
							<button
								type="button"
								className="urlslab-mainmenu-btn"
								onClick={ () => setActivePage( 'TagsLabels' ) }>
								<span>{ __( 'Tags' ) }</span>
							</button>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</nav>
	);
}
