import { useEffect, useState } from 'react';
import { fetchModules, setModule } from '../api';

export default function useModules( reload ) {
	const modulesStorage = sessionStorage.getItem( 'modules' );
	const [ modulesStatus, setModulesStatus ] = useState( modulesStorage || {} );

	const activateModule = ( slug, result ) => {
		setModule( slug, { active: true } ).then(
			( response ) => {
				if ( response.ok ) {
					let modules = JSON.parse( modulesStorage );
					modules = { ...modules, [ slug ]: { ...modules[ slug ], active: true } };
					sessionStorage.setItem( 'modules', JSON.stringify( modules ) );
					setModulesStatus( modules );
					result( true );
					return true;
				}
			}
		);
	};

	useEffect( () => {
		if ( ! modulesStorage ) {
			fetchModules().then( ( mods ) => {
				sessionStorage.setItem( 'modules', JSON.stringify( mods ) );
				setModulesStatus( mods );
			} );
		}
	}, [ ] );

	if ( reload ) {
		return { modulesStatus, activateModule };
	}

	if ( Object.keys( modulesStatus )?.length ) {
		return { modulesStatus, activateModule };
	}

	return {
		modulesStatus: JSON.parse( modulesStorage ),
		activateModule,
	};
}
