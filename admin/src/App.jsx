import { useMemo, useState, Suspense, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { update } from 'idb-keyval';

import { getData } from './api/fetching';
import { fetchSettings } from './api/settings';
import { fetchLangs } from './api/fetchLangs';

import HeaderHeightContext from './lib/headerHeightContext';
import MainMenu from './components/MainMenu';
import DynamicModule from './components/DynamicModule';
import Header from './components/Header';

import './assets/styles/style.scss';

export default function App() {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const [ module, setModule ] = useState( 'urlslab-modules' );
	const [ prefetch, setPrefetch ] = useState( true );
	const [ headerTopHeight, setHeaderTopHeight ] = useState( 58 );
	const [ headerBottomHeight, setHeaderBottomHeight ] = useState( 51.5 );
	const value = { headerTopHeight, setHeaderTopHeight, headerBottomHeight, setHeaderBottomHeight };

	useEffect( () => {
		if ( prefetch ) {
			update( 'apiKeySet', () => true );
			// Checking if API is set in advance
			async function getApiKey() {
				const generalData = await queryClient.fetchQuery( {
					queryKey: [ 'general' ],
					queryFn: () => fetchSettings( 'general' ).then( ( data ) => data ),
					refetchOnWindowFocus: false,
				} );

				const isApiObject = generalData?.filter( ( dataset ) => dataset.id === 'api' )[ 0 ];
				const hasApiKey = isApiObject?.options[ 'urlslab-api-key' ].value;

				if ( ! hasApiKey ) {
					update( 'apiKeySet', ( ) => false );
				}
			}
			getApiKey();

			// Creating languages query object in advance
			queryClient.prefetchQuery( {
				queryKey: [ 'languages' ],
				queryFn: async () => await fetchLangs(),
				refetchOnWindowFocus: false,
			} );

			/* Creating all endpoints query object in advance
			to check for required import CSV fields */
			queryClient.prefetchQuery( {
				queryKey: [ 'routes' ],
				queryFn: async () => await getData(),
				refetchOnWindowFocus: false,
			} );

			setPrefetch( false );
		}
	}, [] );

	const { data } = useQuery( {
		queryKey: [ 'modules' ],
		queryFn: async () => {
			if ( prefetch ) {
				return await getData( 'module' ).then( ( ModuleData ) => ModuleData );
			}
		},
		refetchOnWindowFocus: false,
	} );

	const fetchedModules = useMemo( () => {
		delete data?.general;
		return data;
	}, [ data ] );

	const [ pageTitle, setTitle ] = useState( __( 'Modules' ) );

	const handleModulePage = ( selectedModule ) => {
		setModule( selectedModule );
		if ( selectedModule === 'urlslab-modules' ) {
			setTitle( __( 'Modules' ) );
		}
		if ( selectedModule === 'urlslab-settings' ) {
			setTitle( __( 'Settings' ) );
		}
		if ( selectedModule === 'urlslab-schedule' ) {
			setTitle( __( 'Schedules' ) );
		}
		if ( selectedModule !== 'urlslab-modules' && selectedModule !== 'urlslab-settings' && selectedModule !== 'urlslab-schedule' ) {
			setTitle( fetchedModules[ selectedModule ].title );
		}
	};

	return (
		<div className="urlslab-app flex">
			{
				fetchedModules &&
				<Suspense>
					<MainMenu
						modules={ ! fetchedModules || Object.values( fetchedModules ) }
						activePage={ ( selectedModule ) => handleModulePage( selectedModule ) }
						activeModule={ module }
					/>
				</Suspense>
			}
			{ /* </Suspense> */ }
			<HeaderHeightContext.Provider value={ value }>
				<div className="urlslab-app-main">
					<Header pageTitle={ ! pageTitle || pageTitle } />

					<DynamicModule
						modules={ ! fetchedModules || Object.values( fetchedModules ) }
						moduleId={ module }
						activePage={ ( selectedModule ) => handleModulePage( selectedModule ) }
					/>
				</div>
			</HeaderHeightContext.Provider>

		</div>
	);
}
