import { useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import { getModuleNameFromRoute, renameModule } from '../lib/helpers';
import useModulesQuery from '../queries/useModulesQuery';
import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import useModulesGroups from '../hooks/useModulesGroups';

import { ReactComponent as ModulesIcon } from '../assets/images/menu-icon-modules.svg';
import { ReactComponent as SettingsIcon } from '../assets/images/menu-icon-settings.svg';

import Tooltip from '@mui/joy/Tooltip';

import '../assets/styles/components/_MainMenu.scss';

export default function MainMenu() {
	const { __ } = useI18n();
	const mainmenu = useRef();
	const { pathname } = useLocation();
	const moduleInRoute = getModuleNameFromRoute( pathname );

	const setActiveTable = useTableStore( ( state ) => state.setActiveTable );
	const resetPanelsStore = useTablePanels( ( state ) => state.resetPanelsStore );

	const { data: modules = {}, isSuccess: isSuccessModules } = useModulesQuery();
	const groups = useModulesGroups();

	const loadedModules = Object.values( modules );

	const getMenuDimensions = useCallback( () => {
		const adminmenuHeight = document.querySelector( '#adminmenuback' ).clientHeight;
		document.documentElement.style.setProperty( '--adminmenuHeight', `${ adminmenuHeight }px` );
	}, [] );

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
	}, [ getMenuDimensions, resetPanelsStore, setActiveTable ] );

	return ( ( isSuccessModules && loadedModules ) &&
	<nav className={ `urlslab-mainmenu` } ref={ mainmenu }>
		<div className="urlslab-mainmenu-main">
			<ul className="urlslab-mainmenu-menu">
				{ Object.keys( groups ).length

					? Object.entries( groups ).map( ( [ groupKey, group ] ) => {
						return groupKey !== 'General' &&
						<>
							<li key={ groupKey }
								className={ `urlslab-mainmenu-item urlslab-modules has-icon ${ activator( groupKey ) ? 'active' : '' }` }>
								<Link
									to={ `/${ groupKey }` }
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
										const moduleGroup = Object.keys( module.group )[ 0 ];
										return (
											moduleGroup !== 'General' && moduleGroup === groupKey
												? <Tooltip
													placement="right"
													title={ ! module.active ? __( 'Module inactive', 'urlslab' ) : null }
												>
													<li key={ module.id } className={ `urlslab-mainmenu-item ${ ! module.active ? 'disabled' : '' } ${ activator( moduleName ) }` } style={ { zIndex: ! module.active ? 5 : 3 } }>
														<Link
															to={ `/${ moduleName }` }
															className="urlslab-mainmenu-btn"
														>
															<span>{ module.title }</span>
														</Link>
													</li>
												</Tooltip>
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
					className={ `urlslab-mainmenu-item urlslab-settings has-icon ${ activator( 'General' ) }` }>
					<Link
						to="/Settings"
						className="urlslab-mainmenu-btn has-icon"
					>
						<SettingsIcon />
						<span>{ __( 'General', 'urlslab' ) }</span>
					</Link>
				</li>

				<li className="urlslab-mainmenu-item submenu">
					<ul className="urlslab-mainmenu-submenu">
						<li key="TagsLabels"
							className={ `urlslab-mainmenu-item ${ activator( 'TagsLabels' ) }` }>
							<Link
								to="/TagsLabels"
								className="urlslab-mainmenu-btn"
							>
								<span>{ __( 'Tags', 'urlslab' ) }</span>
							</Link>
						</li>
						<li key="urlslab-settings"
							className={ `urlslab-mainmenu-item ${ activator( 'Settings' ) }` }>
							<Link
								to="/Settings"
								className="urlslab-mainmenu-btn"
							>
								<span>{ __( 'Settings', 'urlslab' ) }</span>
							</Link>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</nav>
	);
}
