import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import SimpleButton from '../elements/SimpleButton';

import '../assets/styles/components/_TableViewHeader.scss';

export default function TableViewHeader( { tableMenu, activeMenu } ) {
	const { __ } = useI18n();
	const [ active, setActive ] = useState( 'overview' );

	const menuItems = new Map( [
		[ 'overview', __( 'Overview' ) ],
		[ 'settings', __( 'Settings' ) ],
	] );

	const handleMenu = ( menukey ) => {
		setActive( menukey );
		if ( activeMenu ) {
			activeMenu( menukey );
		}
	};

	const activator = ( menukey ) => {
		if ( menukey === active ) {
			return 'active';
		}
		return '';
	};

	return (

		<div className="urlslab-tableView-header">
			<div className="urlslab-tableView-headerTop">
				<SimpleButton key={ 'overview' }
					className={ activator( 'overview' ) }
					onClick={ () => handleMenu( 'overview' ) }
				>
					{ menuItems.get( 'overview' ) }
				</SimpleButton>
				{ tableMenu
					? Array.from( tableMenu ).map( ( [ key, value ] ) => {
						return <SimpleButton key={ key }
							className={ activator( key ) }
							onClick={ () => handleMenu( key ) }
						>
							{ value }
						</SimpleButton>;
					} )
					: null
				}
				<SimpleButton key={ 'settings' }
					className={ activator( 'settings' ) }
					onClick={ () => handleMenu( 'settings' ) }
				>
					{ menuItems.get( 'settings' ) }
				</SimpleButton>
			</div>
		</div>
	);
}
