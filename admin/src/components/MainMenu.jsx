import { useRef, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';
import { get, set, del } from 'idb-keyval';

import { getModuleNameFromRoute, renameModule } from '../lib/helpers';
import useModulesQuery from '../queries/useModulesQuery';
import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';

import { ReactComponent as MenuArrow } from '../assets/images/arrow-simple.svg';
import { ReactComponent as ModulesIcon } from '../assets/images/menu-icon-modules.svg';
import { ReactComponent as SettingsIcon } from '../assets/images/menu-icon-settings.svg';

import '../assets/styles/components/_MainMenu.scss';

export default function MainMenu() {
	const { __ } = useI18n();
	const mainmenu = useRef();
	const moduleInRoute = getModuleNameFromRoute( useLocation().pathname );

	const resetTableStore = useTableStore( ( state ) => state.resetTableStore );
	const resetPanelsStore = useTablePanels( ( state ) => state.resetPanelsStore );

	const { data: modules = {}, isSuccess: isSuccessModules } = useModulesQuery();

	const loadedModules = Object.values( modules );
	const activeModules = useMemo( () => loadedModules.length ? loadedModules.filter( ( mod ) => mod.active ) : [], [ loadedModules ] );

	const getMenuDimensions = () => {
		const doc = document.documentElement;
		let urlslabmenuWidth = mainmenu?.current?.clientWidth;
		const adminmenuHeight = document.querySelector( '#adminmenuback' ).clientHeight;
		doc.style.setProperty( '--adminmenuHeight', `${ adminmenuHeight }px` );
		doc.style.setProperty( '--urlslabmenuWidth', `${ urlslabmenuWidth }px` );
		mainmenu?.current?.addEventListener( 'transitionend', () => {
			urlslabmenuWidth = mainmenu?.current?.clientWidth;
			doc.style.setProperty( '--urlslabmenuWidth', `${ urlslabmenuWidth }px` );
		} );
	};

	const handleMainMenu = ( ) => {
		const menuState = mainmenu?.current?.classList.contains( 'open' );
		if ( menuState ) {
			del( 'urlslab-mainmenu' ).then( () => {
				mainmenu?.current?.classList.remove( 'open' );
			} );
		}

		if ( ! menuState ) {
			set( 'urlslab-mainmenu', 'open' ).then( () => {
				mainmenu?.current?.classList.add( 'open' );
			} );
		}
		getMenuDimensions();
	};

	const activator = ( activateRoute ) => {
		if ( activateRoute === moduleInRoute ) {
			return 'active';
		}
		return '';
	};

	useEffect( () => {
		// Resets states
		handleMainMenu();
		getMenuDimensions();
		resetTableStore();
		resetPanelsStore();

		get( 'urlslab-mainmenu' ).then( ( val ) => {
			if ( val === 'open' || window.matchMedia( '(min-width: 1600px)' ).matches ) {
				mainmenu.current?.classList.add( 'open' );
				getMenuDimensions();
			}
		} );

		const resizeWatcher = new ResizeObserver( ( [ entry ] ) => {
			if ( entry.borderBoxSize && mainmenu.current ) {
				getMenuDimensions();
			}
		} );

		resizeWatcher.observe( document.documentElement );
	}, [ handleMainMenu ] );

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
		<div className="urlslab-mainmenu-main">
			<ul className="urlslab-mainmenu-menu">
				<li key="urlslab-modules-main"
					className={ `urlslab-mainmenu-item urlslab-modules has-icon ${ activator( '' ) }` }>
					<Link
						to="/"
						className="urlslab-mainmenu-btn has-icon"
					>
						<ModulesIcon />
						<span>{ __( 'Modules' ) }</span>
					</Link>

				</li>
				<li className="urlslab-mainmenu-item submenu">
					<ul className="urlslab-mainmenu-submenu" style={ { '--activeModules': activeModules.length + 1 } }>
						<li key="urlslab-modules"
							className={ `urlslab-mainmenu-item ${ activator( '' ) }` }>
							<Link
								to="/"
								className="urlslab-mainmenu-btn"
							>
								{ __( 'All modules' ) }
							</Link>
						</li>
						{ loadedModules.length
							? loadedModules.map( ( module ) => {
								const moduleName = renameModule( module.id );
								return (
									module.id !== 'general' && module.active
										? <li key={ module.id } className={ `urlslab-mainmenu-item ${ activator( moduleName ) }` }>
											<Link
												to={ moduleName }
												className="urlslab-mainmenu-btn"
											>
												<span>{ module.title }</span>
											</Link>
										</li>
										: ''
								);
							} )
							: ''
						}
					</ul>
				</li>

				<li key="urlslab-settings-main"
					className={ `urlslab-mainmenu-item urlslab-settings has-icon ${ activator( 'Settings' ) }` }>
					<Link
						to="Settings"
						className="urlslab-mainmenu-btn has-icon"
					>
						<SettingsIcon />
						<span>{ __( 'Settings' ) }</span>
					</Link>
				</li>

				<li className="urlslab-mainmenu-item submenu">
					<ul className="urlslab-mainmenu-submenu">
						<li key="urlslab-settings"
							className={ `urlslab-mainmenu-item ${ activator( 'Settings' ) }` }>
							<Link
								to="Settings"
								className="urlslab-mainmenu-btn"
							>
								<span>{ __( 'General Settings' ) }</span>
							</Link>
						</li>
						<li key="urlslab-schedule"
							className={ `urlslab-mainmenu-item ${ activator( 'Schedule' ) }` }>
							<Link
								to="Schedule"
								className="urlslab-mainmenu-btn"
							>
								<span>{ __( 'Domain Scheduling' ) }</span>
							</Link>
						</li>
						<li key="TagsLabels"
							className={ `urlslab-mainmenu-item ${ activator( 'TagsLabels' ) }` }>
							<Link
								to="TagsLabels"
								className="urlslab-mainmenu-btn"
							>
								<span>{ __( 'Tags Manager' ) }</span>
							</Link>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</nav>
	);
}
