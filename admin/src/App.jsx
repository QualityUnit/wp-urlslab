import { useState, useEffect, Suspense } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { fetchModules } from './api/modules';
import MainMenu from './components/MainMenu';
import DynamicModule from './components/DynamicModule';
import Loader from './components/Loader';
import './assets/styles/style.scss';
import Header from './components/Header';
import SettingsMenu from './components/SettingsMenu';

export default function App() {
	const { __ } = useI18n();
	const [ module, setModule ] = useState( 'urlslab-modules' );
	const [ fetchedModules, setModulesData ] = useState( );
	const [ pageTitle, setTitle ] = useState( __( 'Modules' ) );

	const handleModuleValues = ( moduleId, value ) => {
		if ( module === 'urlslab-modules' ) {
			setModulesData( { ...fetchedModules, [ moduleId ]: { ...fetchedModules[ moduleId ], active: value } } );
		}
	};

	const handleModulePage = ( selectedModule ) => {
		setModule( selectedModule );
		if ( selectedModule === 'urlslab-modules' ) {
			setTitle( __( 'Modules' ) );
		}
		if ( selectedModule === 'urlslab-settings' ) {
			setTitle( __( 'Settings' ) );
		}
		if ( selectedModule !== 'urlslab-modules' && selectedModule !== 'urlslab-settings' ) {
			setTitle( fetchedModules[ selectedModule ].title );
		}
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
		<>
			<Header pageTitle={ ! pageTitle || pageTitle } />

			<div className="urlslab-app flex">
				<nav className="urlslab-mainmenu">
					<div className={ `urlslab-mainmenu-inn ${ module }` }>
						<Suspense>
							<MainMenu
								modules={ ! fetchedModules || Object.values( fetchedModules ) }
								activeModule={ module }
								activePage={ ( selectedModule ) => handleModulePage( selectedModule ) }
							/>
							<SettingsMenu
								modules={ ! fetchedModules || Object.values( fetchedModules ) }
								activePage={ ( selectedModule ) => handleModulePage( selectedModule ) }
							/>
						</Suspense>
					</div>
				</nav>
				<Suspense fallback={ <Loader /> }>
					<DynamicModule
						modules={ ! fetchedModules || Object.values( fetchedModules ) }
						moduleId={ module }
						onChange={ ( moduleId, value ) => handleModuleValues( moduleId, value ) }
					/>
				</Suspense>
			</div>
		</>
	);
}
