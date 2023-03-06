import { useState, Suspense } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { fetchData } from './api/fetching';
import { fetchLangs } from './api/fetchLangs';
import MainMenu from './components/MainMenu';
import DynamicModule from './components/DynamicModule';
import Loader from './components/Loader';
import Header from './components/Header';

import './assets/styles/style.scss';

export default function App() {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const [ module, setModule ] = useState( 'urlslab-modules' );
	// Creating languages query object in advance
	queryClient.prefetchQuery( {
		queryKey: [ 'languages' ],
		queryFn: async () => {
			return await fetchLangs();
		},
	} );
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
					activeModule={ module }
				/>
			</Suspense>
			<div className="urlslab-app-main">
				<Header pageTitle={ ! pageTitle || pageTitle } />

				<Suspense fallback={ <Loader /> }>
					<DynamicModule
						modules={ ! fetchedModules || Object.values( fetchedModules ) }
						moduleId={ module }
						activePage={ ( selectedModule ) => handleModulePage( selectedModule ) }
					/>
				</Suspense>
			</div>
		</div>

	);
}
