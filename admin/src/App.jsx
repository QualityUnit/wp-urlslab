import { useState, useEffect, Suspense } from 'react';
import { fetchModules } from './api/modules';
import MainMenu from './components/MainMenu';
import DynamicModule from './components/DynamicModule';
import Loader from './components/Loader';
import './assets/styles/common/global.scss';

export default function App() {
	const [ module, setModule ] = useState( 'urlslab-modules' );
	const [ fetchedModules, setModulesData ] = useState( );

	// console.log( fetchedModules );

	const handleModuleValues = ( moduleId, value ) => {
		if ( module === 'urlslab-modules' ) {
			setModulesData( { ...fetchedModules, [ moduleId ]: { ...fetchedModules[ moduleId ], active: value } } );
		}
	};

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
				onChange={ ( moduleId, value ) => handleModuleValues( moduleId, value ) }
			/>
		</Suspense>
	);
}
