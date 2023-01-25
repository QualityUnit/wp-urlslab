import { useState, useEffect, Suspense } from 'react';
import { fetchModules } from './api/modules';
import MainMenu from './components/MainMenu';
import DynamicModule from './components/DynamicModule';
import Loader from './components/Loader';
import './assets/styles/common/global.scss';

export default function App() {
	const [ module, setModule ] = useState( 'urlslab-modules' );
	const [ fetchedModules, setModulesData ] = useState( );

	const handleModuleActivation = ( moduleId, activated ) => {
		setModulesData( { ...fetchedModules, [ moduleId ]: { ...fetchedModules[ moduleId ], active: activated } } );
	};
	// console.log( fetchedModules );

	const handleModulePage = ( selectedModule ) => {
		setModule( selectedModule );
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

	return (
		<Suspense fallback={ <Loader /> }>
			<MainMenu
				modules={ ! fetchedModules || Object.values( fetchedModules ) }
				activePage={ ( selectedModule ) => handleModulePage( selectedModule ) }
			/>

			<DynamicModule
				modules={ ! fetchedModules || Object.values( fetchedModules ) }
				moduleId={ module }
			/>
		</Suspense>
	);
}
