import { useMemo, useState, Suspense, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { update } from 'idb-keyval';

import { fetchData, postFetch } from './api/fetching';
import { fetchSettings } from './api/settings';
import { fetchLangs } from './api/fetchLangs';

import HeaderHeightContext from './lib/headerHeightContext';
import hexToHSL from './lib/hexToHSL';

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
				queryFn: async () => await fetchData(),
				refetchOnWindowFocus: false,
			} );

			// Creating Tags/Labels query object in advance
			queryClient.prefetchQuery( {
				queryKey: [ 'label', 'menu' ],
				queryFn: async () => {
					const tags = await postFetch( 'label', { rows_per_page: 500 } );
					const tagsArray = await tags.json();
					tagsArray?.map( ( tag ) => {
						const { lightness } = hexToHSL( tag.bgcolor );
						if ( lightness < 70 ) {
							return tag.className = 'dark';
						}
						return tag;
					} );
					return tagsArray;
				},
				refetchOnWindowFocus: false,
			} );

			// Creating Tags/Labels query object in advance
			queryClient.prefetchQuery( {
				queryKey: [ 'label', 'modules' ],
				queryFn: async () => await fetchData( 'label/modules' ),
				refetchOnWindowFocus: false,
			} );

			setPrefetch( false );
		}
	}, [] );

	const { data } = useQuery( {
		queryKey: [ 'modules' ],
		queryFn: async () => {
			if ( prefetch ) {
				return await fetchData( 'module' ).then( ( ModuleData ) => ModuleData );
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
		if ( selectedModule === 'TagsLabels' ) {
			setTitle( __( 'Tags' ) );
		}
		if ( selectedModule !== 'urlslab-modules' && selectedModule !== 'urlslab-settings' && selectedModule !== 'urlslab-schedule' && selectedModule !== 'TagsLabels' ) {
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
