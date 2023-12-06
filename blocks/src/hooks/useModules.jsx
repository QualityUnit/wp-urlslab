import { useEffect, useState } from 'react';
import { fetchModule, setModule } from '../api';

export default function useModules( { moduleSlug } ) {
	const [ moduleStatus, setModuleStatus ] = useState( );

	const activateModule = ( slug ) => {
		setModule( slug, { active: true } ).then(
			( response ) => response.json()
		).then( ( data ) => setModuleStatus( data ) );
	};

	useEffect( () => {
		fetchModule( moduleSlug ).then( ( mods ) => {
			setModuleStatus( mods );
		} );
	}, [ moduleSlug ] );

	if ( moduleStatus && Object.keys( moduleStatus )?.length ) {
		return { moduleStatus, activateModule };
	}

	return {
		moduleStatus,
		activateModule,
	};
}
