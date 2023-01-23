import { useState, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { fetchModules } from './api/modules';
import MainMenu from './components/MainMenu';
import Modules from './pages/Modules';
import DynamicModule from './components/DynamicModule';
import Loader from './components/Loader';
import './assets/styles/common/global.scss';

export default function App() {
	const { __ } = useI18n();
	let modules = null;
	const [ module, showModule ] = useState( '' );
	const [ fetchedModules, setModulesData ] = useState( );

	const handleModuleActivation = ( moduleId, activated ) => {
		setModulesData( { ...fetchedModules, [ moduleId ]: { ...fetchedModules[ moduleId ], active: activated } } );
	};

	const handleModulePage = ( selectedModule ) => {
		showModule( selectedModule );

		// setTitle( fetchedModules[ selectedModule ].title );
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
			<Loader>{ __( 'Loading URLslab…' ) }</Loader>
		);
	}

	modules = Object.values( fetchedModules );
	return (
		<>
			{ fetchedModules
				? (
					<>
						<MainMenu modules={ modules } activePage={ ( selectedModule ) => handleModulePage( selectedModule ) } />
						{ ! module
							? <Modules modules={ modules } onChange={ ( moduleId, activated ) => handleModuleActivation( moduleId, activated ) } />
							: <DynamicModule moduleId={ module } />
						}
					</> )
				: ''
			}
		</>

	);
}
