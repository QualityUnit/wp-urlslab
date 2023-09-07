import { Link } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';
import { update } from 'idb-keyval';

import SimpleButton from '../elements/SimpleButton';

import '../assets/styles/components/_ModuleViewHeader.scss';
import { useEffect } from 'react';
import useTableStore from '../hooks/useTableStore';

export default function ModuleViewHeader( { moduleId, moduleMenu, activeSection, noSettings } ) {
	const { __ } = useI18n();

	useEffect( () => {
		useTableStore.setState( { filters: {} } );
		useTableStore.setState( { sorting: [] } );
	}, [] );

	const menuItems = new Map( [
		[ 'overview', __( 'Overview' ) ],
		[ 'settings', __( 'Settings' ) ],
	] );

	const rememberActiveMenu = ( state ) => {
		useTableStore.setState( { filters: {} } );
		useTableStore.setState( { sorting: [] } );
		update( moduleId, ( dbData ) => {
			return { ...dbData, activeMenu: state };
		} );
	};

	const activator = ( menukey ) => {
		if ( menukey === activeSection ) {
			return 'active';
		}
		return '';
	};

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
