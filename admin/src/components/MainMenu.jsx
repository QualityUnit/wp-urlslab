import { useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';
import { get } from 'idb-keyval';

import { getModuleNameFromRoute, renameModule } from '../lib/helpers';
import useModulesQuery from '../queries/useModulesQuery';
import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import useModuleGroups from '../hooks/useModuleGroups';

import { ReactComponent as ModulesIcon } from '../assets/images/menu-icon-modules.svg';
import { ReactComponent as SettingsIcon } from '../assets/images/menu-icon-settings.svg';

import '../assets/styles/components/_MainMenu.scss';

import Tooltip from '../elements/Tooltip';

export default function MainMenu() {
	const { __ } = useI18n();
	const mainmenu = useRef();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const moduleInRoute = getModuleNameFromRoute( pathname );
	const doc = document.documentElement;

	const setActiveTable = useTableStore( ( state ) => state.setActiveTable );
	const resetPanelsStore = useTablePanels( ( state ) => state.resetPanelsStore );
	const activeGroup = useModuleGroups( ( state ) => state.activeGroup );
	const setActiveGroup = useModuleGroups( ( state ) => state.setActiveGroup );

	const { data: modules = {}, isSuccess: isSuccessModules } = useModulesQuery();

	const loadedModules = Object.values( modules );

	const moduleGroups = useMemo( () => {
		let groups = {};
		if ( loadedModules.length ) {
			groups = loadedModules.reduce( ( acc, module ) => ( { ...acc, [ Object.keys( module.group )[ 0 ] ]: Object.values( module.group )[ 0 ] } ), {} );
		}
		return groups;
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

		if ( ! activeGroup ) {
			get( 'lastActivePage' ).then( ( obj ) => setActiveGroup( { key: obj.pathname.replace( '/', '' ), group: obj.group } ) );
		}

		const resizeWatcher = new ResizeObserver( ( [ entry ] ) => {
			if ( entry.borderBoxSize && mainmenu.current ) {
				getMenuDimensions();
			}
		} );

		resizeWatcher.observe( document.documentElement );
	}, [ activeGroup, setActiveGroup ] );

	return ( ( isSuccessModules && loadedModules ) &&
	<nav className={ `urlslab-mainmenu` } ref={ mainmenu }>
		<div className="urlslab-mainmenu-main">
			<ul className="urlslab-mainmenu-menu">
				{ Object.keys( moduleGroups ).length

					? Object.entries( moduleGroups ).map( ( [ groupKey, group ] ) => {
						return groupKey !== 'General' &&
						<>
							<li key={ groupKey }
								className={ `urlslab-mainmenu-item urlslab-modules has-icon ${ groupKey === activeGroup.key ? 'active' : '' }` }>
								<button
									className="urlslab-mainmenu-btn has-icon"
									onClick={ () => {
										setActiveGroup( { key: groupKey, group } );
										navigate( `/${ groupKey.replaceAll( ' ', '' ) }` );
									} }
								>
									<ModulesIcon />
									<span>{ group }</span>
								</button>
							</li>
							<li className="urlslab-mainmenu-item submenu">
								<ul className="urlslab-mainmenu-submenu">

									{ loadedModules.map( ( module ) => {
										const moduleName = renameModule( module.id );
										const moduleGroup = Object.keys( module.group )[ 0 ];
										return (
											moduleGroup !== 'General' && moduleGroup === groupKey
												? <li key={ module.id } className={ `urlslab-mainmenu-item ${ ! module.active ? 'disabled' : '' } ${ activator( moduleName ) }` } style={ { zIndex: ! module.active ? 5 : 3 } }>
													{ ! module.active &&
													<Tooltip className="showOnHover">{ __( 'Module inactive' ) }</Tooltip>
													}

													<Link
														to={ moduleName }
														className="urlslab-mainmenu-btn"
														onClick={ () => setActiveGroup( {} ) }
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
					className={ `urlslab-mainmenu-item urlslab-settings has-icon ${ activator( 'General' ) }` }>
					<Link
						to="Settings"
						className="urlslab-mainmenu-btn has-icon"
					>
						<SettingsIcon />
						<span>{ __( 'General' ) }</span>
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
