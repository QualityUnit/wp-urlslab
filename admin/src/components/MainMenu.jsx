import { useRef, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import { getModuleNameFromRoute, renameModule } from '../lib/helpers';
import useModulesQuery from '../queries/useModulesQuery';
import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';

import { ReactComponent as ModulesIcon } from '../assets/images/menu-icon-modules.svg';
import { ReactComponent as SettingsIcon } from '../assets/images/menu-icon-settings.svg';

import '../assets/styles/components/_MainMenu.scss';

export default function MainMenu() {
	const { __ } = useI18n();
	const mainmenu = useRef();
	const moduleInRoute = getModuleNameFromRoute( useLocation().pathname );
	const doc = document.documentElement;

	const setActiveTable = useTableStore( ( state ) => state.setActiveTable );
	const resetPanelsStore = useTablePanels( ( state ) => state.resetPanelsStore );

	const { data: modules = {}, isSuccess: isSuccessModules } = useModulesQuery();

	const loadedModules = Object.values( modules );

	const moduleGroups = useMemo( () => {
		const groups = [];
		if ( loadedModules.length ) {
			loadedModules.map( ( module ) => groups.push( module.group ) );
		}
		return [ ... new Set( groups ) ];
	}, [ loadedModules ] );

	const getMenuDimensions = () => {
		const adminmenuHeight = document.querySelector( '#adminmenuback' ).clientHeight;
		doc.style.setProperty( '--adminmenuHeight', `${ adminmenuHeight }px` );
	};

	const activator = ( activateRoute ) => {
		if ( activateRoute === moduleInRoute ) {
			return 'active';
		}
		return '';
	};

	useEffect( () => {
		// Resets states
		getMenuDimensions();
		setActiveTable();
		resetPanelsStore();

		const resizeWatcher = new ResizeObserver( ( [ entry ] ) => {
			if ( entry.borderBoxSize && mainmenu.current ) {
				getMenuDimensions();
			}
		} );

		resizeWatcher.observe( document.documentElement );
	}, [ ] );

	return ( ( isSuccessModules && loadedModules ) &&
	<nav className={ `urlslab-mainmenu` } ref={ mainmenu }>
		<div className="urlslab-mainmenu-main">
			<ul className="urlslab-mainmenu-menu">
				{ moduleGroups.length

					? moduleGroups.map( ( group ) => {
						return group !== 'General' &&
						<>
							<li key={ group }
								className={ `urlslab-mainmenu-item urlslab-modules has-icon` }>
								<Link
									to={ `/${ group }` }
									state={ { group } }
									className="urlslab-mainmenu-btn has-icon"
								>
									<ModulesIcon />
									<span>{ group }</span>
								</Link>
							</li>
							<li className="urlslab-mainmenu-item submenu">
								<ul className="urlslab-mainmenu-submenu">

									{ loadedModules.map( ( module ) => {
										const moduleName = renameModule( module.id );
										return (
											module.group !== 'General' && module.group === group
												? <li key={ module.id } className={ `urlslab-mainmenu-item ${ ! module.active && 'disabled' } ${ activator( moduleName ) }` }>
													<Link
														to={ moduleName }
														state={ { group } }
														className="urlslab-mainmenu-btn"
													>
														<span>{ module.title }</span>
													</Link>
												</li>
												: null
										);
									} )
									}
								</ul>
							</li>
						</>;
					} )
					: null
				}

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
						<li key="urlslab-schedule"
							className={ `urlslab-mainmenu-item ${ activator( 'Schedule' ) }` }>
							<Link
								to="Schedule"
								className="urlslab-mainmenu-btn"
							>
								<span>{ __( 'My Domains' ) }</span>
							</Link>
						</li>
						<li key="TagsLabels"
							className={ `urlslab-mainmenu-item ${ activator( 'TagsLabels' ) }` }>
							<Link
								to="TagsLabels"
								className="urlslab-mainmenu-btn"
							>
								<span>{ __( 'Tags' ) }</span>
							</Link>
						</li>
						<li key="urlslab-settings"
							className={ `urlslab-mainmenu-item ${ activator( 'Settings' ) }` }>
							<Link
								to="Settings"
								className="urlslab-mainmenu-btn"
							>
								<span>{ __( 'Settings' ) }</span>
							</Link>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</nav>
	);
}
