import { useState, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { fetchModules } from './api/modules';
import MainMenu from './components/MainMenu';
import Modules from './pages/Modules';
import './assets/styles/common/global.scss';

export default function App() {
	const { __ } = useI18n();
	const [ module, showModule ] = useState( );
	const [ fetchedModules, setModulesData ] = useState( );

	const handleModuleActivation = ( moduleId, activated ) => {
		setModulesData( { ...fetchedModules, [ moduleId ]: { ...fetchedModules[ moduleId ], active: activated } } );
	};

	useEffect( () => {
		if ( ! fetchedModules ) {
			fetchModules().then( ( ModulesData ) => {
				if ( ModulesData ) {
					setModulesData( ModulesData );
				}
			} );
		}
	}, [ fetchedModules ] );

	if ( ! fetchedModules ) {
		return (
			<h2 className="urlslab-loader">{ __( 'Loading URLslab…' ) }</h2>
		);
	}

	const modules = Object.values( fetchedModules );

	return (
		<>
			{ fetchedModules
				? (
					<>
						<MainMenu modules={ modules } activePage={ ( activePage ) => {
							showModule( activePage );
						} } />
						{ ! module
							? <Modules modules={ modules } onChange={ ( moduleId, activated ) => handleModuleActivation( moduleId, activated ) } />
							: <div style={ { height: '10em', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' } }><h2>This is demo module page</h2></div>
						}
					</> )
				: ''
			}
		</>

	);
}
