import { useState, Suspense } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { fetchData } from './api/fetching';
import MainMenu from './components/MainMenu';
import DynamicModule from './components/DynamicModule';
import Loader from './components/Loader';
import Header from './components/Header';

import './assets/styles/style.scss';
import Button from './elements/Button';

export default function App() {
	const { __ } = useI18n();
	const [ module, setModule ] = useState( 'urlslab-modules' );
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
		<div className="urlslab-app flex">
			<Suspense>
				<MainMenu
					modules={ ! fetchedModules || Object.values( fetchedModules ) }
					activePage={ ( selectedModule ) => handleModulePage( selectedModule ) }
				/>
			</Suspense>
			<Suspense fallback={ <Loader /> }>
				<div className="urlslab-app-main">
					<Header pageTitle={ ! pageTitle || pageTitle } />
					<Button className="active" onClick={ () => exportTest() }>Demo Worker</Button>
					<DynamicModule
						modules={ ! fetchedModules || Object.values( fetchedModules ) }
						moduleId={ module }
					/>
				</div>
			</Suspense>
		</div>
	);
}
