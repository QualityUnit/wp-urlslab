import { useCallback, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router-dom';

import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import useUserLocalData from '../hooks/useUserLocalData';

import SimpleButton from '../elements/SimpleButton';

import '../assets/styles/components/_ModuleViewHeader.scss';

const menuItems = new Map( [
	[ 'overview', __( 'Overview', 'urlslab' ) ],
	[ 'settings', __( 'Settings', 'urlslab' ) ],
] );

export default function ModuleViewHeader( { moduleId, moduleMenu, activeSection, noSettings } ) {
	const setActiveTable = useTableStore( ( state ) => state.setActiveTable );
	const resetPanelsStore = useTablePanels( ( state ) => state.resetPanelsStore );
	const setUserLocalData = useUserLocalData( ( state ) => state.setUserLocalData );

	useEffect( () => {
		// Cleaning filtering and sorting etc of table on header loading
		setActiveTable();
		resetPanelsStore();
	}, [ resetPanelsStore, setActiveTable ] );

	const rememberActiveMenu = useCallback( ( state ) => {
		// Cleaning filters and sorting of table etc on module submenu change
		setActiveTable();
		resetPanelsStore();

		setUserLocalData( moduleId, { activeMenu: state } );
	}, [ moduleId, resetPanelsStore, setActiveTable, setUserLocalData ] );

	const activator = ( menukey ) => menukey === activeSection ? 'active' : '';

	return (

		<div className="urlslab-moduleView-header">
			<div className="urlslab-moduleView-headerTop">
				<Link to="overview" >
					<SimpleButton
						className={ activator( 'overview' ) }
						onClick={ () => rememberActiveMenu( 'overview' ) }
					>
						{ menuItems.get( 'overview' ) }
					</SimpleButton>
				</Link>
				{ moduleMenu
					? Array.from( moduleMenu ).map( ( [ key, value ] ) => {
						return (
							<Link key={ key } to={ key } >
								<SimpleButton
									className={ activator( key ) }
									onClick={ () => rememberActiveMenu( key ) }
								>
									{ value }
								</SimpleButton>
							</Link>
						);
					} )
					: null
				}
				{ ! noSettings &&
					<Link to="settings">
						<SimpleButton
							className={ activator( 'settings' ) }
							onClick={ () => rememberActiveMenu( 'settings' ) }
						>
							{ menuItems.get( 'settings' ) }
						</SimpleButton>
					</Link>
				}
			</div>
		</div>
	);
}
