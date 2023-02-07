import { useState, Suspense } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { fetchData } from './api/fetching';
import MainMenu from './components/MainMenu';
import DynamicModule from './components/DynamicModule';
import Loader from './components/Loader';
import './assets/styles/style.scss';
import Header from './components/Header';
import SettingsMenu from './components/SettingsMenu';

export default function App() {
	const { __ } = useI18n();
	const [ module, setModule ] = useState( 'urlslab-modules' );
	const [ setting, setActiveSetting ] = useState( 'general' );
	const { data: fetchedModules } = useQuery( {
		queryKey: [ 'modules' ],
		queryFn: () => fetchData( 'module' ).then( ( ModuleData ) => {
			return ModuleData;
		} ),
	} );

	const [ pageTitle, setTitle ] = useState( __( 'Modules' ) );

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

	return (
		<>
			<Header pageTitle={ ! pageTitle || pageTitle } />

			<div className="urlslab-app flex">
				<nav className="urlslab-mainmenu">
					<div className={ `urlslab-mainmenu-inn ${ module }` }>
						<Suspense>
							<MainMenu
								modules={ ! fetchedModules || Object.values( fetchedModules ) }
								activePage={ ( selectedModule ) => handleModulePage( selectedModule ) }
							/>
							<SettingsMenu
								modules={ ! fetchedModules || Object.values( fetchedModules ) }
								backButton={ ( selectedModule ) => handleModulePage( selectedModule ) }
								activeSetting={ ( selectedSetting ) => setActiveSetting( selectedSetting ) }
							/>
						</Suspense>
					</div>
				</nav>
				<Suspense fallback={ <Loader /> }>
					<DynamicModule
						modules={ ! fetchedModules || Object.values( fetchedModules ) }
						moduleId={ module }
						settingId={ setting }
					/>
				</Suspense>
			</div>
		</>
	);
}
